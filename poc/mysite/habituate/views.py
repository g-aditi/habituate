from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import base64
import os
from .mlinference import *

result_ready = 0
result = {}
guid_object = 0
gFileName = ""
gText = ""


def index(request):
    return HttpResponse("Hello, You're at the Base index. Please go to /habituate !!!")


def getFilePath(folderName, fileName):
    return os.path.join(folderName, fileName)


def combine_data():
    global guid_object
    global gFileName
    print("combine_data()")
    if guid_object == 2:
        print("all here")
        guid_object = 0
        print(process_image(gFileName, gText, "Programming is my hobby"))


@csrf_exempt
def upload_file(request):
    global guid_object
    global gFileName
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method!"}, status=400)

    fileName = request.POST.get("fileName")

    chunk_data = request.POST.get("chunkData")
    # Handle missing chunkIndex
    chunk_index = int(request.POST.get("chunkIndex", -1))
    # Handle missing totalChunks
    total_chunks = int(request.POST.get("totalChunks", -1))

    if not all([fileName, chunk_data, chunk_index >= 0, total_chunks >= 0]):
        return JsonResponse({"error": "Missing or invalid upload data."}, status=400)

    Upload_directory = os.path.join("uploads", "images")
    os.makedirs(Upload_directory, exist_ok=True)

    file_chunk_name = getFilePath(Upload_directory, f"{fileName}_{chunk_index}")
    file_final_name = getFilePath(Upload_directory, fileName)

    try:
        # Store the chunk data in a temporary location
        with open(file_chunk_name, "wb") as chunk_file:
            chunk_file.write(base64.b64decode(chunk_data))

        # Check if all chunks have been received
        if chunk_index == total_chunks - 1:
            # Reassemble the chunks into the original file
            with open(file_final_name, "wb") as file_obj:
                for i in range(total_chunks):
                    chunk_path = getFilePath(Upload_directory, f"{fileName}_{i}")
                    with open(chunk_path, "rb") as chunk_file:
                        file_obj.write(chunk_file.read())

            # Run ML Inference Algo
            gFileName = getFilePath(Upload_directory, fileName)
            guid_object += 1
            combine_data()

            # Remove temporary chunk files (success case)
            for i in range(total_chunks):
                os.remove(getFilePath(Upload_directory, f"{fileName}_{i}"))

            return JsonResponse({"error": None, "success": True}, status=201)  # Created

        else:
            # Chunk upload successful
            return JsonResponse({"error": None, "success": False}, status=200)

    except (IOError, OSError) as e:
        # Handle file system errors during upload or merging
        print(e)
        return JsonResponse({"error": f"File upload failed: {str(e)}"}, status=500)


@csrf_exempt
def upload_text(request):
    global result_ready
    global result
    global guid_object
    global gText
    print("at upload text endpoint")
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method!"}, status=400)

    text = request.POST.get("text")
    fileName = request.POST.get("fileName")

    gText = text
    # Run ML Inference Algo
    guid_object += 1
    # combine_data()

    # write text from the request to a file
    text_directory = os.path.join("uploads", "text")
    os.makedirs(os.path.join(text_directory), exist_ok=True)
    # Create 'uploads/text' directory if it doesn't exist
    text_file_path = os.path.join(text_directory, fileName)
    with open(text_file_path, "w") as text_file:
        text_file.write(text)

    result_ready = 1
    result["text"] = text

    return JsonResponse({"error": None}, status=200)


def download(request):
    print("at download endpoint")
    global result_ready
    global result
    if result_ready == 1:
        print("Sending the Response")
        if "text" in result:
            return JsonResponse({"error": None, "data": result["text"]}, status=200)
        else:
            return JsonResponse({"error": "Image text data is null"})

    else:
        return JsonResponse({"error": "Inference result is not yet ready"})


def get_text(request):
    text = "This is some text data"
    return HttpResponse(text, content_type="text/plain")


def get_image(request):
    # Simulate image data (replace with your logic)
    image_data = b"This is some image data (replace with actual image bytes)"
    base64_encoded_image = base64.b64encode(image_data).decode("utf-8")
    # Adjust content type as needed
    return HttpResponse(base64_encoded_image, content_type="image/jpeg")
