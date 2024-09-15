from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd

@csrf_exempt
def FileUploadView(request):
    if request.method == 'POST':
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file part'}, status=400)
        file = request.FILES['file']
        try:
            # Log file information for debugging
            print(f'File received: {file.name}, size: {file.size}')
            
            # Check the file extension
            if not file.name.endswith('.xlsx'):
                return JsonResponse({'error': 'Invalid file type'}, status=400)
            
            # Process the file
            df = pd.read_excel(file)
            return JsonResponse({'message': 'File processed successfully'})
        except Exception as e:
            print(f'Error: {str(e)}')  # Log the error
            return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
