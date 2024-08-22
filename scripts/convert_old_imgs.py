import csv
import requests
from pathlib import Path

# Function to get the user ID from the credits field or prompt the user if not available
def get_user_id(post_details, user_id_cache):
    credits = post_details.get("credits", None)
    if credits in user_id_cache:
        return user_id_cache[credits]

    if credits:
        user_id = input(f"Enter the user ID to credit for '{credits}': ")
        user_id_cache[credits] = user_id
        return user_id
    else:
        user_id = input("No 'credits' found, please enter the user ID: ")
        return user_id

# Function to upload the post and then use the returned post ID to upload the image
def upload_post(data, user_id_cache):
    # Extract data from the row
    post_id, plant_id, filename, _, post_data, _ = data

    # Parse post_data (assuming it is JSON-like)
    post_details = eval(post_data)
    post_title = post_details.get("name", "No Title")
    post_image = filename

    real_file_path = filename.replace("’", "'")

    # Get user ID from post details or prompt
    user_id = get_user_id(post_details, user_id_cache)

    # Prepare post data
    payload = {
        'title': post_title,
        'plant': plant_id,
        'image': post_image,
        'user_id': user_id
    }

    # Upload post data and get the new post ID from the response
    response = requests.post('http://localhost:3000/api/posts/new', params=payload)
    if response.status_code == 200:
        new_post_id = response.json().get('id')
        if new_post_id:
            print(f"Post uploaded successfully with ID: {new_post_id}")
        else:
            print(f"Failed to retrieve post ID from the response: {response.text}")
            return
    else:
        print(f"Failed to upload post: {response.text}")
        return

    # Compress and upload the image using the new post ID
    image_path = Path(f"data/{plant_id}/{real_file_path}")
    if not image_path.exists():
        print(f"Image not found: {image_path}")
        return

    with open(image_path, 'rb') as img_file:
        files = {'file': (real_file_path, img_file, 'image/jpeg')}
        formData = {
            'id': new_post_id,
            'path': f'users/{user_id}/posts'
        }

        # Upload image file
        image_response = requests.post('http://localhost:3000/api/files/upload', files=files, data=formData)
        if image_response.status_code == 200:
            print(f"Uploaded {real_file_path} successfully.")
        else:
            print(f"Failed to upload {real_file_path}: {image_response.text}")

# Initialize cache for user IDs
user_id_cache = {}

# Read CSV data
csv_file_path = 'old_attachments.csv'  # Replace with your CSV file path
with open(csv_file_path, mode='r', encoding='utf-8') as file:
    csv_reader = csv.reader(file)

    # Iterate over each row in the CSV file
    for row in csv_reader:
        upload_post(row, user_id_cache)
