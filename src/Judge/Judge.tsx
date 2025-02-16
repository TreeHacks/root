import React from 'react';
import '../Review/Review.scss';

interface checkInSchema {
    checkedIn: Boolean;
    checkedInBy: string;
    checkedInAt: Date;
    tshirtSize: string;
}

interface mealInfoSchema {
    usedMeals: [string];
    dietaryRestrictions: string;
}

interface IJudgeProps {
    applicationSchema: { schema: any; uiSchema: any };
}

interface IJudgeComponentState {
    _id: string;
    year: string;
    forms: {
        application_info: {
            first_name: string;
            last_name: string;
        };
        check_in_info: checkInSchema;
        meal_info: mealInfoSchema;
    };
    user: {
        id: string;
        email: string;
    };
}

class Judge extends React.Component<IJudgeProps, IJudgeComponentState> {
    constructor(props: IJudgeProps) {
        super(props);
        this.state = {
            _id: '',
            year: '',
            forms: {
                application_info: {
                    first_name: '',
                    last_name: ''
                },
                check_in_info: {
                    checkedIn: false,
                    checkedInBy: '',
                    checkedInAt: new Date(),
                    tshirtSize: ''
                },
                meal_info: {
                    usedMeals: [''],
                    dietaryRestrictions: ''
                }
            },
            user: {
                id: '',
                email: ''
            }
        };
    }
}

export default Judge;