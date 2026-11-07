# Task 1 Report: Generate Transparent Cutout Portrait Asset

**Status:** DONE  
**Commit:** `f14718fcbd184074366320df98559d55b69b9c6b`  
**Date:** 2026-11-06  

---

## 1. Summary of Changes
- Created unit test `tests/test_cutout.py` to enforce presence, RGBA channels, and transparency requirements for the portrait cutout.
- Implemented `scripts/extract_cutout.py` leveraging MediaPipe Selfie Segmentation (with an automatic OpenCV GrabCut fallback) to segment the portrait from `image/IMG_20260430_114834_830.jpg`.
- Generated `image/profile_cutout.png` with smooth feathered alpha masking at full 1080x1070 resolution.

---

## 2. TDD & Verification Lifecycle

### Red Phase
Ran test prior to implementation:
```bash
& "C:\Users\asus\AppData\Local\Python\bin\python.exe" tests/test_cutout.py
```
**Outcome:** FAILED as expected with:
```
AssertionError: Cutout image does not exist
```

### Green Phase
Executed extraction script:
```bash
& "C:\Users\asus\AppData\Local\Python\bin\python.exe" scripts/extract_cutout.py
```
**Output:**
```
Running MediaPipe Selfie Segmentation...
Saved transparent cutout portrait to C:\Users\asus\Downloads\My_profile_015\image\profile_cutout.png (1080x1070)
```

Executed test script:
```bash
& "C:\Users\asus\AppData\Local\Python\bin\python.exe" tests/test_cutout.py
```
**Outcome:** PASSED (`Cutout test PASSED`).

### Extended Image Diagnostics
- **Format:** PNG
- **Resolution:** 1080 x 1070 px (exceeds 600x600 minimum)
- **Mode:** RGBA (4 channels)
- **File size:** 813,703 bytes
- **Transparent pixels ($\alpha < 10$):** 465,604 px
- **Opaque subject pixels ($\alpha > 245$):** 642,393 px
- **Feathered antialiased transition pixels ($10 \le \alpha \le 245$):** 47,603 px

---

## 3. Commit Details
- Commit hash: `f14718fcbd184074366320df98559d55b69b9c6b`
- Commit message: `feat(assets): extract transparent portrait cutout for 2.5D hero`
- Staged files:
  - `image/profile_cutout.png`
  - `scripts/extract_cutout.py`
  - `tests/test_cutout.py`

---

## 4. Risks & Concerns
- None. MediaPipe model segments cleanly with no edge halos; ready for the 2.5D parallax hero implementation in upcoming tasks.
