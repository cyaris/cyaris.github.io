import pandas as pd
import numpy as np
from copy import deepcopy
from traceback import format_exc

def define_c_code_dic():
    c_code_df = pd.read_csv('/Users/the_networks_of_war/data_sources/csvs/COW country codes.csv', encoding = 'utf8')
    c_code_df.rename({'CCode': 'c_code',
                      'StateNme': 'country'}, axis=1, inplace = True)
    c_code_df.drop(['StateAbb'], axis=1, inplace = True)

    duplicate_list = ['c_code', 'country']
    c_code_df.drop_duplicates(subset = duplicate_list, keep = 'first', inplace = True)
    c_code_df = deepcopy(c_code_df.reset_index(drop = True))

    c_code_dic = {}
    for i, c_code in enumerate(c_code_df['c_code']):
        c_code_dic[c_code] = c_code_df.loc[i, 'country']

    print('Total Country Codes: {}'.format(format(len(c_code_dic.keys()), ',d')))

    return c_code_dic


def start_and_end_dates(dataframe):

    ## creatign a field for ongoing wars
    dataframe.loc[dataframe['end_day']==-7, 'ongoing_participation'] = 1
    dataframe.loc[dataframe['ongoing_participation'].isnull(), 'ongoing_participation'] = 0

    ## defining null values (missing or non-applicable data)
    ## includes ongoing wars (end date is non-applicable)
    dataframe.loc[dataframe['start_day'].astype(float)<=0, 'start_day'] = None
    dataframe.loc[dataframe['start_month'].astype(float)<=0, 'start_month'] = None
    dataframe.loc[dataframe['start_year'].astype(float)<=0, 'start_year'] = None
    dataframe.loc[dataframe['end_day'].astype(float)<=0, 'end_day'] = None
    dataframe.loc[dataframe['end_month'].astype(float)<=0, 'end_month'] = None
    dataframe.loc[dataframe['end_year'].astype(float)<=0, 'end_year'] = None

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

    print("Total Rows With Both Dates Found: {}".format(format(dates_found, ',d')))
    print("Total Rows With At Least One Date Not Found: {}\n".format(format(dates_not_found, ',d')))

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

    dataframe = deepcopy(pd.concat([dataframe, union_dataframe], sort=True, ignore_index=True).reset_index(drop=True))

    duplicate_list = list(dataframe.columns)
    dataframe.drop_duplicates(subset=duplicate_list, keep='first', inplace=True)

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
    x_y_z_columns = []

    for i, column in enumerate(column_list):
        if column[-2:]=='_x':
            x_y_z_columns.append(column)
        elif column[-2:]=='_y':
            x_y_z_columns.append(column)
        elif column[-2:]=='_z':
            x_y_z_columns.append(column)

    null_values = 0
    unknown_values = 0
    ## filling in nulls with zeros
    ## these are ones that most likely mean zero if null (not due to missing data)
    for column in x_y_z_columns:
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

    print('\nTotal Columns Adjusted: {}'.format(format(len(x_y_z_columns), ',d')))
    if conversion_dic==None:
        print('Total Columns Adjusted for Conversion: 0')
    else:
        print('Total Columns Adjusted for Conversion: {}'.format(format(len(list(conversion_dic.keys())) * 2, ',d')))
    print('Total Null Values Notated: {}'.format(format(null_values, ',d')))
    print('Total Unknown Values Notated: {}'.format(format(unknown_values, ',d')))

    return dataframe


def format_part_df_from_dyadic_data(part_dataframe, extra_switch_columns_list):
    ## whoever is originally marked as side a is getting labelled as 1.
    ## whoever is originally marked as side b is getting labelled as 2.
    part_dataframe['side_a'] = 1
    part_dataframe['side_b'] = 2

    part_dataframe = deepcopy(start_and_end_dates(part_dataframe))

    ## unioning mismatching columns so each participant will get their own row
    switched_columns_list = ['c_code_a',
                             'c_code_b',
                             'participant_a',
                             'participant_b',
                             'side_a',
                             'side_b',
                             'battle_deaths_a',
                             'battle_deaths_b']

    if extra_switch_columns_list==None:
        pass
    else:
        for column in extra_switch_columns_list:
            switched_columns_list.append(column)

    part_dataframe = deepcopy(union_opposite_columns(part_dataframe, switched_columns_list))

    ## making a copy before duplicates a taken out.
    ## this will be used below for dyadic data (since no dyadic files are available for intra-state wars)
    dy_df = deepcopy(part_dataframe[['war_num',
                                     'c_code_a',
                                     'c_code_b',
                                     'participant_a',
                                     'participant_b',
                                     'side_a',
                                     'side_b',
                                     'start_year',
                                     'battle_deaths_a',
                                     'battle_deaths_b']])
    ## this will be adjusted again later
    dy_df.rename({'start_year': 'year'}, axis=1, inplace=True)

    # keeping one state (or non-state) per war after duplicate removal
    duplicate_list = ['war_num', 'c_code_a', 'participant_a']
    part_dataframe.drop_duplicates(subset=duplicate_list, keep='first', inplace=True)
    part_dataframe = deepcopy(part_dataframe.reset_index(drop=True))
    part_dataframe = deepcopy(drop_participant_b_columns(part_dataframe, switched_columns_list))

    ## removing non applicable participants
    ## don't need to do this for inter-state war because all is applicable
    part_dataframe = deepcopy(part_dataframe[part_dataframe['participant']!='-8']).reset_index(drop=True)
    dy_df = deepcopy(dy_df[(dy_df['participant_a']!='-8') & (dy_df['participant_b']!='-8')]).reset_index(drop=True)

    return part_dataframe, dy_df


def add_missing_dyads(part_df, dy_df, war_input, side_input, opposition_type):

    opposing_side_dic = {1: 2, 2: 1}
    if opposition_type=='all_participants':
        c_code_a = part_df[(part_df['war_num']==war_input) & (part_df['side']==side_input)]['c_code'].values[0]
        participant_a = part_df[(part_df['war_num']==war_input) & (part_df['side']==side_input)]['participant'].values[0]
    elif opposition_type=='non-state':
        c_code_a = part_df[(part_df['war_num']==war_input) & (part_df['side']==side_input) & (part_df['c_code']==-8)]['c_code'].values[0]
        participant_a = part_df[(part_df['war_num']==war_input) & (part_df['side']==side_input) & (part_df['c_code']==-8)]['participant'].values[0]
    opposing_participants = sorted(list(set(list(part_df[(part_df['war_num']==war_input) & (part_df['side']==opposing_side_dic[side_input])]['participant']))))
    dyadic_parties = sorted(list(set(list(dy_df[dy_df['war_num']==war_input]['participant_a']) + list(dy_df[dy_df['war_num']==war_input]['participant_b']))))
    for i, party_b in enumerate(opposing_participants):
        if party_b in dyadic_parties and len(dyadic_parties) > 0:
            pass
        else:
            df_length = deepcopy(len(dy_df))
            dy_df.loc[df_length, 'war_num'] = war_input
            dy_df.loc[df_length, 'c_code_a'] = c_code_a
            dy_df.loc[df_length, 'participant_a'] = participant_a
            dy_df.loc[df_length, 'year'] = part_df[(part_df['war_num']==war_input) & (part_df['participant']==party_b)]['start_year'].values[0]
            dy_df.loc[df_length, 'c_code_b'] = part_df[(part_df['war_num']==war_input) & (part_df['participant']==party_b)]['c_code'].values[0]
            dy_df.loc[df_length, 'participant_b'] = party_b

    return dy_df

def descriptive_dyad_from_source(descriptive_df, dyad_df_initial, source, dataframe, c_code_a, c_code_b, year, binary_field):

    if source==None:
        dy_df = deepcopy(dataframe)[[c_code_a, c_code_b, year]]
    else:
        dy_df = pd.read_csv(source, encoding='utf8')[[c_code_a, c_code_b, year]]
    dy_df.rename({c_code_a: 'c_code_a',
                  c_code_b: 'c_code_b',
                  year: 'year'}, axis=1, inplace=True)
    # removing any duplicates that may have occured
    duplicate_columns_list = ['c_code_a', 'c_code_b', 'year']
    dy_df.drop_duplicates(subset=duplicate_columns_list, keep='first', inplace=True)
    ## creating a binary field to represent this dataset
    ## more specific fields can be added later
    dy_df[binary_field] = 1
    ## unioning mismatching columns so each participant will get their own row
    switched_columns_list = ['c_code_a', 'c_code_b']
    dy_df = deepcopy(union_opposite_columns(dy_df, switched_columns_list))
    ## intergrating the descriptive data into the master dataframe for all dyads
    descriptive_df = deepcopy(pd.merge(descriptive_df, dy_df, how='left', on=['c_code_a', 'c_code_b', 'year']))

    return descriptive_df


def descriptive_dyad_from_dd(descriptive_df, df_dd, conditional_statement, binary_field):

    df_dd = deepcopy(df_dd[conditional_statement][['c_code_a', 'c_code_b', 'year']])
    ## removing any duplicates that may have occured
    duplicate_columns_list = ['c_code_a', 'c_code_b', 'year']
    df_dd.drop_duplicates(subset=duplicate_columns_list, keep='first', inplace=True)
    ## creating a binary field to represent this conditional statement
    df_dd[binary_field] = 1
    ## unioning mismatching columns so each participant will get their own row
    switched_columns_list = ['c_code_a',
                             'c_code_b']
    df_dd = deepcopy(union_opposite_columns(df_dd, switched_columns_list))
    ## intergrating the descriptive data into the master dataframe for all dyads
    descriptive_df = deepcopy(pd.merge(descriptive_df, df_dd, how='left', on=['c_code_a', 'c_code_b', 'year']))

    return descriptive_df


def print_new_fields(descriptive_df, initial_columns, descriptive_columns):

    ## using this field for both the descriptive dataframes, and the dyadic dataframes joined to descriptive data.
    ## the descriptive dataframes have duplicates from unions while the dyadic dataframes do not.

    ## only need the initial columns if descriptive columns not provided
    if descriptive_columns==None:
        descriptive_columns = deepcopy(set(list(descriptive_df.columns)))
        descriptive_columns = deepcopy(list(descriptive_columns - initial_columns))

    print_dic = {}
    for column in descriptive_columns:
        if initial_columns==None:
            print_dic[column] = len(descriptive_df[descriptive_df[column]==1])
        else:
            print_dic[column] = int(len(descriptive_df[descriptive_df[column]==1])/2)

    print_df = pd.DataFrame(list(print_dic.items()), columns=['field', 'dyads'])

    if initial_columns==None:
        print_df.loc[(['_z' in s[-2:] for s in print_df['field']]), 'timeframe'] = 'Overall'
        print_df.loc[(['_y' in s[-2:] for s in print_df['field']]), 'timeframe'] = 'Last Year'
        print_df.loc[(['_x' in s[-2:] for s in print_df['field']]), 'timeframe'] = 'First Year'
        print_df = deepcopy(print_df[['timeframe', 'field', 'dyads']])
        for i, field in enumerate(print_df['field']):
            print_df.loc[i, 'field'] = field[:-2]

        print_df.sort_values(by=['dyads', 'field', 'timeframe'], ascending=(False, True, True), inplace=True)

        print(print_df.to_string(index=False, header=False))
    else:
        print_df.sort_values(by=['dyads', 'field'], ascending=(False, True), inplace=True)
        print(print_df.to_string(index=False, header=False))

    return
