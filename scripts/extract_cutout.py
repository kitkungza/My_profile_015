"""Extract a transparent cutout portrait asset from input portrait image.

Uses MediaPipe Selfie Segmentation (with OpenCV GrabCut fallback)
to segment the subject and generate an RGBA PNG with smooth feathered edges.
"""

import os
import sys
import tempfile
import urllib.request
import cv2
import numpy as np
from PIL import Image

MODEL_URL = "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite"

def get_model_path() -> str:
    temp_dir = tempfile.gettempdir()
    model_path = os.path.join(temp_dir, "selfie_segmenter.tflite")
    if not os.path.exists(model_path):
        print(f"Downloading selfie segmentation model to {model_path}...")
        try:
            urllib.request.urlretrieve(MODEL_URL, model_path)
        except Exception as e:
            print(f"Failed to download model: {e}")
            return ""
    return model_path

def segment_mediapipe(rgb_image: np.ndarray, model_path: str) -> np.ndarray:
    import mediapipe as mp
    options = mp.tasks.vision.ImageSegmenterOptions(
        base_options=mp.tasks.BaseOptions(model_asset_path=model_path),
        running_mode=mp.tasks.vision.RunningMode.IMAGE,
        output_confidence_masks=True,
    )
    with mp.tasks.vision.ImageSegmenter.create_from_options(options) as segmenter:
        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_image)
        result = segmenter.segment(mp_img)
        conf = result.confidence_masks[0].numpy_view()[:, :, 0]
        # Soft feathering mapping to preserve fine edges without background bleed
        low_th = 0.05
        high_th = 0.85
        alpha = np.clip((conf - low_th) / (high_th - low_th), 0.0, 1.0)
        return (alpha * 255.0).astype(np.uint8)

def segment_grabcut(rgb_image: np.ndarray) -> np.ndarray:
    h, w = rgb_image.shape[:2]
    mask = np.zeros((h, w), np.uint8)
    bgd_model = np.zeros((1, 65), np.float64)
    fgd_model = np.zeros((1, 65), np.float64)
    rect = (int(w * 0.05), int(h * 0.05), int(w * 0.90), int(h * 0.90))
    cv2.grabCut(rgb_image, mask, rect, bgd_model, fgdModel=fgd_model, iterCount=5, mode=cv2.GC_INIT_WITH_RECT)
    mask2 = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype("uint8")
    mask_blurred = cv2.GaussianBlur(mask2, (7, 7), 2)
    return mask_blurred

def extract_cutout(input_path: str, output_path: str) -> None:
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input image not found: {input_path}")

    bgr = cv2.imread(input_path)
    if bgr is None:
        raise ValueError(f"Could not load image: {input_path}")
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)

    alpha = None
    model_path = get_model_path()
    if model_path and os.path.exists(model_path):
        try:
            print("Running MediaPipe Selfie Segmentation...")
            alpha = segment_mediapipe(rgb, model_path)
        except Exception as e:
            print(f"MediaPipe segmentation failed: {e}, falling back to OpenCV GrabCut")

    if alpha is None:
        print("Running OpenCV GrabCut segmentation...")
        alpha = segment_grabcut(rgb)

    # Combine RGB channels with alpha channel
    rgba = np.dstack([rgb, alpha])
    out_img = Image.fromarray(rgba, mode="RGBA")
    
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    out_img.save(output_path, "PNG", optimize=True)
    print(f"Saved transparent cutout portrait to {output_path} ({out_img.size[0]}x{out_img.size[1]})")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)
    input_path = os.path.join(repo_root, "image", "IMG_20260430_114834_830.jpg")
    output_path = os.path.join(repo_root, "image", "profile_cutout.png")

    extract_cutout(input_path, output_path)

if __name__ == "__main__":
    main()
