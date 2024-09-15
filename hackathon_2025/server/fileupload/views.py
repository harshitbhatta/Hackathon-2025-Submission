from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
from .python_csv import *
import os
from django.conf import settings
from .python_csv import main
from uuid import uuid4

@csrf_exempt
def FileUploadView(request):
    if request.method == 'POST':
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file part'}, status=400)
        file = request.FILES['file']
        try:
            print("NOOO")
            # Log file information for debugging
            print(f'File received: {file.name}, size: {file.size}')
            
            # Check the file extension
            if not file.name.endswith('.csv'):
                return JsonResponse({'error': 'Invalid file type'}, status=400)
            
            # Process the file
            print("recieved df")
            dataframe = pd.read_csv(file)
            print(dataframe.head())

            # Create a unique filename
            # output_filename = f'df_performance_{uuid4()}.csv'
            # output_file_path = os.path.join(settings.MEDIA_ROOT, output_filename)
            
            main(dataframe)
            
            # response = FileResponse(open(output_file_path, 'rb'), content_type='text/csv')
            # response['Content-Disposition'] = f'attachment; filename={output_filename}'
            # return 
            return JsonResponse({'message': 'File processed successfully'})
        except Exception as e:
            print(f'Error: {str(e)}')  # Log the error
            return JsonResponse({'error': f'Error processing file: {str(e)}'}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_processed_data(request):
    try:
        # Path to the CSV file
        file_path = 'df_performance.csv'
        
        if not os.path.exists(file_path):
            return JsonResponse({'error': 'No processed file found'}, status=404)
        
        # Load the CSV file into a DataFrame
        df = pd.read_csv(file_path)
        
        # Convert DataFrame to JSON
        data = df.to_dict(orient='records')
        print("data successfully converted into json")
        # print(data[0][0])
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'error': f'Error retrieving data: {str(e)}'}, status=500)
