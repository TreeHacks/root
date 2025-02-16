import React from 'react';
import '../Review/Review.scss';

interface IJudgeProps {
    applicationSchema: { schema: any; uiSchema: any };
}
interface IJudgeComponentState {
    _id: string,
    year: string,
    workshop_attended: any,
    forms: any,
    user: any,
}

class Judge extends React.Component<IJudgeProps, IJudgeComponentState> {
    constructor(props: IJudgeProps) {
        super(props);
        this.state = {
            _id: null,
            year: null,
            workshop_attended: null,
            forms: null,
            user: null
        };
    }
}

export default Judge;