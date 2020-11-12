import pandas as pd
import numpy as np
from copy import deepcopy
from traceback import format_exc

def participant_start_and_end_dates(dataframe):

    ## defining null values (missing data)
    dataframe.loc[dataframe['start_day']==-9, 'start_day'] = None
    dataframe.loc[dataframe['start_month']==-9, 'start_month'] = None
    dataframe.loc[dataframe['start_year']==-9, 'start_year'] = None
    dataframe.loc[dataframe['end_day']==-9, 'end_day'] = None
    dataframe.loc[dataframe['end_month']==-9, 'end_month'] = None
    dataframe.loc[dataframe['end_year']==-9, 'end_year'] = None

    ## creatign a field for ongoing wars
    dataframe.loc[dataframe['end_day']==-7, 'ongoing_participation'] = 1
    dataframe.loc[dataframe['ongoing_participation'].isnull(), 'ongoing_participation'] = 0
    ## adjusting for ongoing with wars with current date end date
    dataframe.loc[dataframe['end_day']==-7, 'end_day'] = None
    dataframe.loc[dataframe['end_month']==-7, 'end_month'] = None
    dataframe.loc[dataframe['end_year']==-7, 'end_year'] = None

    ## calculating null for all without valid start/end dates.
    ## those with invalid data will have null values.
    ## this will need to be improved
    dates_found = 0
    dates_not_found = 0

    for i, date in enumerate(dataframe['war_num']):

        ## unsure why this occurs (.0 after integer)
        dataframe.loc[i, 'start_day'] = str(dataframe.loc[i, 'start_day']).split('.')[0]
        dataframe.loc[i, 'start_month'] = str(dataframe.loc[i, 'start_month']).split('.')[0]
        dataframe.loc[i, 'start_year'] = str(dataframe.loc[i, 'start_year']).split('.')[0]
        dataframe.loc[i, 'end_day'] = str(dataframe.loc[i, 'end_day']).split('.')[0]
        dataframe.loc[i, 'end_month'] = str(dataframe.loc[i, 'end_month']).split('.')[0]
        dataframe.loc[i, 'end_year'] = str(dataframe.loc[i, 'end_year']).split('.')[0]

        try:
            dataframe.loc[i, 'start_date'] = pd.to_datetime(dataframe.loc[i, 'start_year'] + "-" + dataframe.loc[i, 'start_month'] + "-" + dataframe.loc[i, 'start_day'])
            valid_start_date = 1
        except:
            valid_start_date = 0
            dataframe.loc[i, 'start_date'] = None
        try:
            dataframe.loc[i, 'end_date'] = pd.to_datetime(dataframe.loc[i, 'end_year'] + "-" + dataframe.loc[i, 'end_month'] + "-" + dataframe.loc[i, 'end_day'])
            valid_end_date = 1
        except:
            valid_end_date = 0
            dataframe.loc[i, 'end_date'] = None

        if valid_start_date==1 and valid_end_date==1:
            dataframe.loc[i, 'days_at_war'] = dataframe.loc[i, 'end_date'] - dataframe.loc[i, 'start_date']
            dataframe.loc[i, 'days_at_war'] = int(str(dataframe.loc[i, 'days_at_war']).split(' ')[0])
        else:
            dataframe.loc[i, 'days_at_war'] = None

        if valid_start_date + valid_end_date==2:
            dates_found += 1
        else:
            dates_not_found+=1

    print("total rows with both dates found: {}".format(dates_found))
    print("total rows with at least one date not found: {}\n".format(dates_not_found))

    return dataframe


def remaining_participant_null_values(dataframe):

    ## defining null values (missing data)
    ## -8 is not applicable.
    dataframe.loc[dataframe['battle_deaths']==-8, 'battle_deaths'] = None
    dataframe.loc[dataframe['total_deaths_both_sides']==-8, 'total_deaths_both_sides'] = None
    dataframe.loc[dataframe['peak_forces_available']==-8, 'peak_forces_available'] = None
    dataframe.loc[dataframe['peak_battle_forces']==-8, 'peak_battle_forces'] = None
    dataframe.loc[dataframe['lagging_war']==-8, 'lagging_war'] = None
    dataframe.loc[dataframe['leading_war']==-8, 'leading_war'] = None
    ## -9 is unknown.
    dataframe.loc[dataframe['battle_deaths']==-9, 'battle_deaths'] = None
    dataframe.loc[dataframe['total_deaths_both_sides']==-9, 'total_deaths_both_sides'] = None
    dataframe.loc[dataframe['peak_forces_available']==-9, 'peak_forces_available'] = None
    dataframe.loc[dataframe['peak_battle_forces']==-9, 'peak_battle_forces'] = None

    return dataframe


def union_opposite_columns(dataframe, switched_columns_list):

    union_dataframe = deepcopy(dataframe)

    ## doing these inefficient column name changes to fill in for a much needed sql union of mismatching column names
    for column in switched_columns_list:
        union_dataframe.rename({column: column + '_new'}, axis=1, inplace=True)

    for column in switched_columns_list:
        if column[-2:]=='_a':
            union_dataframe.rename({column + '_new': column[:-1] + 'b'}, axis=1, inplace=True)
        elif column[-2:]=='_b':
            union_dataframe.rename({column + '_new': column[:-1] + 'a'}, axis=1, inplace=True)
        else:
            pass

    dataframe = deepcopy(pd.concat([dataframe, union_dataframe], ignore_index=True).reset_index(drop=True))

    return dataframe


def drop_participant_b_columns(dataframe, switched_columns_list):

    for column in switched_columns_list:
        if column[-2:]=='_b':
            dataframe.drop(column, axis=1, inplace=True)

    for column in switched_columns_list:
        if column[-2:]=='_a':
            dataframe.rename({column: column[:-2]}, axis=1, inplace=True)

    return dataframe


def column_fills_and_converions(dataframe, conversion_dic):

    column_list = list(dataframe.columns)
    x_y_columns = []

    for i, column in enumerate(column_list):
        if column[-2:]=='_x':
            x_y_columns.append(column)
        elif column[-2:]=='_y':
            x_y_columns.append(column)

    null_values = 0
    unknown_values = 0
    ## filling in nulls with zeros
    ## these are ones that most likely mean zero if null (not due to missing data)
    for column in x_y_columns:
        null_values = null_values + len(dataframe[dataframe[column].isnull()])
        ## giving this zeros because they weren't in the dataset at all.
        ## no result following join.
        dataframe.loc[dataframe[column].isnull(), column] = 0
        ## -9 is unknown value in the dataset
        ## giving these null values
        unknown_values = unknown_values + len(dataframe[dataframe[column]==-9])
        dataframe.loc[dataframe[column]==-9, column] = None
        if conversion_dic==None:
            pass
        elif column[:-2] in list(conversion_dic.keys()):
            # converting these to their proper units according to documentation
            dataframe[column] = ([s * conversion_dic[column[:-2]] for s in dataframe[column]])

    print('\ntotal columns adjusted: {}'.format(len(x_y_columns)))
    if conversion_dic==None:
        print('total columns adjusted for conversion: 0')
    else:
        print('total columns adjusted for conversion: {}'.format(len(list(conversion_dic.keys())) * 2))
    print('null values notated: {}'.format(null_values))
    print('unknown values notated: {}'.format(unknown_values))

    return dataframe
