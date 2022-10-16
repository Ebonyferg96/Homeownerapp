const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    grossMonthlyIncome: {
        type: Number,
    },
    creditCardPayment: {
        type: Number,
    },
    carPayment: {
        type: Number,
    },
    studentLoanPayments: {
        type: Number,
    },
    appraisedValue: {
        type: Number,
    },
    downPayment: {
        type: Number,
    },
    loanPayment: {
        type: Number,
    },
    monthlyMortgagePayment: {
        type: Number,
    },
    creditScore: {
        type: Number,
    },
});

module.exports = mongoose.model('Client', ClientSchema);


//  grossMonthlyIncome: {type: GraphQLInt},
// creditCardPayment: {type: GraphQLInt}, 
// carPayment: {type: GraphQLInt},
// studentLoanPayments: {type: GraphQLInt},
// appraisedValue: {type: GraphQLInt},
// downPayment: {type: GraphQLInt},
// loanPayment: {type: GraphQLInt},
// monthlyMortgagePayment: {type: GraphQLInt},
// creditScore: {type: GraphQLInt}