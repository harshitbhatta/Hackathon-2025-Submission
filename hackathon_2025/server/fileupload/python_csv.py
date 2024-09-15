import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
def group_data_by_day_frac(dataframe):
    # Convert 'Log.Event Dt' to datetime format
    dataframe['Log.Event Dt'] = pd.to_datetime(dataframe['Log.Event Dt'], format='%m/%d/%Y')

    # Group the data by 'Log.Event Dt', 'Fleet Name', and 'Region Name', then sum numerical columns
    grouped_df = dataframe.groupby(['Log.Event Dt', 'Fleet Name', 'Region Name']).sum(numeric_only=True)

    return grouped_df


# Function to export the dataframe to a CSV file
def export_to_csv(dataframe, file_name):
    # dataframe = dataframe["Performance"].fillna(0, inplace = True)
    # dataframe.to_csv(file_name, index=True)
    # print("nice")
    # print(dataframe[["Performance"]])
    dataframe.to_csv(file_name, index=True)
    print(f"Data has been exported to {file_name}")

# Function to add a 'Performance' column to the dataframe
def add_performance_column(grouped_df):
    # Check if required columns are in the dataframe
    if 'Pumping Hours' in grouped_df.columns and 'Time Available (hrs)' in grouped_df.columns:
        # Calculate the Performance column
        grouped_df['Performance'] = grouped_df['Pumping Hours'] / grouped_df['Time Available (hrs)']
        # grouped_df.dropna(subset=['Performance'], inplace=True)
        # print("dropna has been completed")
        # Move the 'Performance' column next to the 'Pumping Hours' column
        print("This is the first performance", grouped_df.iloc[0]['Performance'])
        c = 0
        for i in range(1,len(grouped_df)):
            # if pd.isna(grouped_df.iloc[i]['Performance']):
            #     # print("found a nan value") 
            #     c += 1
            #     grouped_df.iloc[0]['Performance'] = 0
            # else:
            #     print("not found")
            if grouped_df.iloc[i]['Time Available (hrs)'] > 0:
                grouped_df.iloc[i, grouped_df.columns.get_loc('Performance')] = grouped_df.iloc[i]['Pumping Hours'] / grouped_df.iloc[i]['Time Available (hrs)']
            else:
                print("yes")
                c+=1
                grouped_df.iloc[i, grouped_df.columns.get_loc('Performance')] = 0
        print("Counter", c)
        pumping_hours_index = grouped_df.columns.get_loc('Pumping Hours')
        cols = list(grouped_df.columns)
        cols.insert(pumping_hours_index + 1, cols.pop(cols.index('Performance')))
        grouped_df = grouped_df[cols]
    else:
        print("Required columns for Performance calculation are missing.")

    return grouped_df

def main(dataframe):
    # Load the CSV file (make sure this path is correct in your local environment)
    df = dataframe
    # df.fillna(0, 1, inplace=True)

    # Display the first few rows of the dataframe
    print(df.head())

    # Group the data
    grouped_data = group_data_by_day_frac(df)
    print(grouped_data.shape)

    # Add the 'Performance' column
    df_performance = add_performance_column(grouped_data)
    print(df_performance.head())

    # Export the performance dataframe to CSV
    export_to_csv(df_performance, 'df_performance.csv')







