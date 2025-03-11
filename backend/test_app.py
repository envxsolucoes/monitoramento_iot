import pytest
from fastapi.testclient import TestClient
import os
import shutil
import cv2
import numpy as np
from app import app

client = TestClient(app)

# Setup test environment
def setup_module(module):
    """Setup for the test module"""
    # Create test directories if they don't exist
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("results", exist_ok=True)
    
    # Create a test image
    test_img = np.zeros((100, 100, 3), dtype=np.uint8)
    # Draw a green rectangle
    test_img[30:70, 30:70] = [0, 255, 0]
    cv2.imwrite("test_image.jpg", test_img)

# Cleanup after tests
def teardown_module(module):
    """Cleanup after tests"""
    # Remove test image
    if os.path.exists("test_image.jpg"):
        os.remove("test_image.jpg")

def test_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert "status" in response.json()
    assert response.json()["status"] == "online"

def test_health():
    """Test the health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_upload_image():
    """Test uploading an image"""
    # Open the test image
    with open("test_image.jpg", "rb") as f:
        response = client.post(
            "/upload",
            files={"file": ("test_image.jpg", f, "image/jpeg")}
        )
    
    assert response.status_code == 200
    assert "filename" in response.json()
    assert "file_path" in response.json()
    assert "dimensions" in response.json()
    assert response.json()["dimensions"] == "100x100"
    
    # Store the filename for the next test
    return response.json()["filename"]

def test_analyze_image():
    """Test analyzing an image"""
    # First upload an image
    filename = test_upload_image()
    
    # Now analyze it
    response = client.post(
        f"/analyze/{filename}",
        json={"analysis_type": "color_analysis"}
    )
    
    assert response.status_code == 200
    assert "analysis_id" in response.json()
    assert response.json()["status"] == "processing"
    
    # Store the analysis ID for the next test
    return response.json()["analysis_id"]

def test_get_results():
    """Test getting analysis results"""
    # First analyze an image
    analysis_id = test_analyze_image()
    
    # Wait a bit for processing to complete
    import time
    time.sleep(3)
    
    # Now get the results
    response = client.get(f"/results/{analysis_id}")
    
    assert response.status_code == 200
    assert response.json()["status"] in ["processing", "completed"]
    
    # If completed, check the results
    if response.json()["status"] == "completed":
        assert "results" in response.json()
        results = response.json()["results"]
        assert "dominant_color" in results
        # Since we drew a green rectangle, the dominant color should be green
        assert results["dominant_color"] == "green"

def test_list_results():
    """Test listing all results"""
    # Make sure we have at least one result
    test_analyze_image()
    
    response = client.get("/results")
    
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

if __name__ == "__main__":
    pytest.main(["-xvs", "test_app.py"]) 