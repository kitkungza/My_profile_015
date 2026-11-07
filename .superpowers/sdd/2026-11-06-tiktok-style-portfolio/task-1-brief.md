# Task 1: Generate Transparent Cutout Portrait Asset

**Files:**
- Create: `scripts/extract_cutout.py`
- Create: `image/profile_cutout.png`
- Input: `image/IMG_20260430_114834_830.jpg`

**Interfaces:**
- Consumes: `image/IMG_20260430_114834_830.jpg`
- Produces: `image/profile_cutout.png` (transparent PNG, antialiased edges, minimum 600x600 resolution)

## Global Constraints Verbatim
- Repository root: `C:\Users\asus\Downloads\My_profile_015`
- Python executable: `C:\Users\asus\AppData\Local\Python\bin\python.exe`
- Cutout image must have RGBA channels with true transparent pixels around the subject's portrait.

## Steps
- [ ] **Step 1: Write test script to verify cutout requirements**
Create `tests/test_cutout.py` checking that `image/profile_cutout.png` exists, has 4 channels (RGBA), and contains transparent pixels (alpha < 255):
```python
import os
from PIL import Image

def test_cutout():
    path = "image/profile_cutout.png"
    assert os.path.exists(path), "Cutout image does not exist"
    img = Image.open(path)
    assert img.mode == "RGBA", f"Expected RGBA, got {img.mode}"
    alpha = img.split()[-1]
    has_transparent = any(p < 10 for p in alpha.getdata())
    assert has_transparent, "Image has no transparent background"
    print("Cutout test PASSED")

if __name__ == "__main__":
    test_cutout()
```

- [ ] **Step 2: Run test to verify it fails**
Run: `& "C:\Users\asus\AppData\Local\Python\bin\python.exe" tests/test_cutout.py`
Expected: FAIL with "Cutout image does not exist"

- [ ] **Step 3: Implement cutout extraction script with MediaPipe / OpenCV / PIL**
Write `scripts/extract_cutout.py` using MediaPipe Selfie Segmentation or OpenCV / PIL grabcut / thresholding to segment Kitt's portrait from `image/IMG_20260430_114834_830.jpg` and save as `image/profile_cutout.png` with smooth feathered alpha masking.

- [ ] **Step 4: Run extraction script and verify test passes**
Run extraction: `& "C:\Users\asus\AppData\Local\Python\bin\python.exe" scripts/extract_cutout.py`
Run test: `& "C:\Users\asus\AppData\Local\Python\bin\python.exe" tests/test_cutout.py`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add image/profile_cutout.png scripts/extract_cutout.py tests/test_cutout.py
git commit -m "feat(assets): extract transparent portrait cutout for 2.5D hero"
```
