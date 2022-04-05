# DATA 1202: Assignment #4

### Description 
This project is an assignment for DATA 1202: Data Analysis tools analytics course at Durham College, Canada. The learning outcome of this assignment was to get familiarized with python functions and visualizations. The code included in this repository answers two questions of this assignment. 

### Question 1: To create a function that produces a distribution of top_100 youtube channels grouped by the channel type

A function was created to plot the distribution of the top 1000 channel types. Under this function, “dataframe.iloc” was used to slice the top 1000 rows, and seaborn distribution plot (sns.displot) was used to plot the values. The seaborn plot style was set to ‘white grid,’ and the aspect ratio for the plot was chosen to be 3. The function was called by inputting the first row and last row values using “plot_channel_dist,” which returned the figure for the distribution of the top 1000 channel types.

### Question 2: To create a funtion to retrieve top 1000 youtube channels
A subset of the dataframe was created using “dataframe. iloc” to fetch the first 1000 rows of the dataset.Then,“.to_csv” was used to export the data frame to a CSV file named “Top_1000.csv” with the encoding “cp1252” to allow for special characters (€)

### dataset 
The youtube_dataset.csv is included in the repositry which contains all columns used for this analysis.
