import pandas as pd
import numpy as np
from copy import deepcopy
from traceback import format_exc

def participant_start_and_end_dates(participant_dataframe):

    ## defining null values (missing data)
    participant_dataframe.loc[participant_dataframe['start_day']==-9, 'start_day'] = None
    participant_dataframe.loc[participant_dataframe['start_month']==-9, 'start_month'] = None
    participant_dataframe.loc[participant_dataframe['start_year']==-9, 'start_year'] = None
    participant_dataframe.loc[participant_dataframe['end_day']==-9, 'end_day'] = None
    participant_dataframe.loc[participant_dataframe['end_month']==-9, 'end_month'] = None
    participant_dataframe.loc[participant_dataframe['end_year']==-9, 'end_year'] = None

    ## creatign a field for ongoing wars
    participant_dataframe.loc[participant_dataframe['end_day']==-7, 'ongoing_participation'] = 1
    participant_dataframe.loc[participant_dataframe['ongoing_participation'].isnull(), 'ongoing_participation'] = 0
    ## adjusting for ongoing with wars with current date end date
    participant_dataframe.loc[participant_dataframe['end_day']==-7, 'end_day'] = None
    participant_dataframe.loc[participant_dataframe['end_month']==-7, 'end_month'] = None
    participant_dataframe.loc[participant_dataframe['end_year']==-7, 'end_year'] = None

    ## calculating null for all without valid start/end dates.
    ## those with invalid data will have null values.
    ## this will need to be improved
    dates_found = 0
    dates_not_found = 0

    for i, date in enumerate(participant_dataframe['war_num']):

        ## unsure why this occurs (.0 after integer)
        participant_dataframe.loc[i, 'start_day'] = str(participant_dataframe.loc[i, 'start_day']).split('.')[0]
        participant_dataframe.loc[i, 'start_month'] = str(participant_dataframe.loc[i, 'start_month']).split('.')[0]
        participant_dataframe.loc[i, 'start_year'] = str(participant_dataframe.loc[i, 'start_year']).split('.')[0]
        participant_dataframe.loc[i, 'end_day'] = str(participant_dataframe.loc[i, 'end_day']).split('.')[0]
        participant_dataframe.loc[i, 'end_month'] = str(participant_dataframe.loc[i, 'end_month']).split('.')[0]
        participant_dataframe.loc[i, 'end_year'] = str(participant_dataframe.loc[i, 'end_year']).split('.')[0]

        try:
            participant_dataframe.loc[i, 'start_date'] = pd.to_datetime(participant_dataframe.loc[i, 'start_year'] + "-" + participant_dataframe.loc[i, 'start_month'] + "-" + participant_dataframe.loc[i, 'start_day'])
            valid_start_date = 1
        except:
            valid_start_date = 0
            participant_dataframe.loc[i, 'start_date'] = None
        try:
            participant_dataframe.loc[i, 'end_date'] = pd.to_datetime(participant_dataframe.loc[i, 'end_year'] + "-" + participant_dataframe.loc[i, 'end_month'] + "-" + participant_dataframe.loc[i, 'end_day'])
            valid_end_date = 1
        except:
            valid_end_date = 0
            participant_dataframe.loc[i, 'end_date'] = None

        if valid_start_date==1 and valid_end_date==1:
            participant_dataframe.loc[i, 'days_at_war'] = participant_dataframe.loc[i, 'end_date'] - participant_dataframe.loc[i, 'start_date']
            participant_dataframe.loc[i, 'days_at_war'] = int(str(participant_dataframe.loc[i, 'days_at_war']).split(' ')[0])
        else:
            participant_dataframe.loc[i, 'days_at_war'] = None

        if valid_start_date + valid_end_date==2:
            dates_found += 1
        else:
            dates_not_found+=1

    print("total rows with both dates found {}".format(dates_found))
    print("total rows with at least one date not found {}\n".format(dates_not_found))

    return participant_dataframe


def remaining_participant_null_values(participant_dataframe):

    ## defining null values (missing data)
    ## -8 is not applicable.
    participant_dataframe.loc[participant_dataframe['battle_deaths']==-8, 'battle_deaths'] = None
    participant_dataframe.loc[participant_dataframe['total_deaths_both_sides']==-8, 'total_deaths_both_sides'] = None
    participant_dataframe.loc[participant_dataframe['peak_forces_available']==-8, 'peak_forces_available'] = None
    participant_dataframe.loc[participant_dataframe['peak_battle_forces']==-8, 'peak_battle_forces'] = None
    participant_dataframe.loc[participant_dataframe['lagging_war']==-8, 'lagging_war'] = None
    participant_dataframe.loc[participant_dataframe['leading_war']==-8, 'leading_war'] = None
    ## -9 is unknown.
    participant_dataframe.loc[participant_dataframe['battle_deaths']==-9, 'battle_deaths'] = None
    participant_dataframe.loc[participant_dataframe['total_deaths_both_sides']==-9, 'total_deaths_both_sides'] = None
    participant_dataframe.loc[participant_dataframe['peak_forces_available']==-9, 'peak_forces_available'] = None
    participant_dataframe.loc[participant_dataframe['peak_battle_forces']==-9, 'peak_battle_forces'] = None

    return participant_dataframe


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
