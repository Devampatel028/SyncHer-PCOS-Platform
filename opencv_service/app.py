import cv2
import numpy as np
import io
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def classify_severity(spot_count):
    if spot_count <= 5:
        return "Low"
    elif spot_count <= 15:
        return "Moderate"
    else:
        return "Severe"

def detect_acne(image_bytes):
    """Detect acne spots using OpenCV HSV color analysis."""
    # Decode image bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return None, "Could not decode image"

    # --- 1. Try to detect and crop face region ---
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

    affected_areas = []
    if len(faces) > 0:
        # Use the largest detected face
        x, y, w, h = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
        roi = img[y:y+h, x:x+w]
        affected_areas.append("Face")

        # Sub-divide face to detect zones
        forehead_roi = roi[0:h//3, :]
        cheek_roi    = roi[h//3:2*h//3, :]
        chin_roi     = roi[2*h//3:, :]
        zones = [
            ("Forehead", forehead_roi),
            ("Cheeks",   cheek_roi),
            ("Chin",     chin_roi),
        ]
    else:
        # Fall back to full image if no face detected
        roi = img
        zones = [("Full Image", roi)]
        affected_areas.append("General Area")

    # --- 2. HSV-based acne/redness detection ---
    total_spots = 0
    zone_results = {}

    for zone_name, zone_img in zones:
        if zone_img is None or zone_img.size == 0:
            continue

        hsv = cv2.cvtColor(zone_img, cv2.COLOR_BGR2HSV)

        # Red/inflamed acne hue range in HSV
        lower_red1 = np.array([0,  60, 60])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([160, 60, 60])
        upper_red2 = np.array([180, 255, 255])

        mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
        red_mask = cv2.bitwise_or(mask1, mask2)

        # Morphological ops to clean noise
        kernel = np.ones((5, 5), np.uint8)
        red_mask = cv2.morphologyEx(red_mask, cv2.MORPH_OPEN,  kernel)
        red_mask = cv2.morphologyEx(red_mask, cv2.MORPH_CLOSE, kernel)

        # Find contours (acne blobs)
        contours, _ = cv2.findContours(red_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Filter contours by area (20–2000 px²) to target acne-sized spots
        min_area = 20
        max_area = 2000
        zone_spots = [c for c in contours if min_area < cv2.contourArea(c) < max_area]
        count = len(zone_spots)

        if count > 0:
            zone_results[zone_name] = count
            total_spots += count
            if zone_name not in affected_areas and zone_name != "Full Image":
                affected_areas.append(zone_name)

    severity = classify_severity(total_spots)

    if not affected_areas:
        affected_areas = ["None detected"]

    return {
        "acneLevel":     severity,
        "detectedSpots": total_spots,
        "affectedAreas": affected_areas,
        "zoneBreakdown": zone_results
    }, None


@app.route('/analyze-skin', methods=['POST'])
def analyze_skin():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    image_bytes = image_file.read()

    if len(image_bytes) == 0:
        return jsonify({"error": "Empty image file"}), 400

    result, error = detect_acne(image_bytes)

    if error:
        return jsonify({"error": error}), 422

    return jsonify(result), 200


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "OpenCV Skin Analysis"}), 200


if __name__ == '__main__':
    print("🔬 OpenCV Skin Analysis Service starting on port 8000...")
    app.run(host='0.0.0.0', port=8000, debug=True)
