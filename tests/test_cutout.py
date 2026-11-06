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
