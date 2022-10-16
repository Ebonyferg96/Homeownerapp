const {clients} = require('../sampleData.js')

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt,GraphQLFloat, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType} = require('graphql')

//Mongoose Models
const Project = require('../models/Project');
const Client = require('../models/Client');
//Make type for each objects
//Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    //Query fields which returns objects
    fields: () => ({
        id: {type: GraphQLID}, 
        grossMonthlyIncome: {type: GraphQLFloat},
        creditCardPayment: {type: GraphQLFloat}, 
        carPayment: {type: GraphQLFloat},
        studentLoanPayments: {type: GraphQLFloat},
        appraisedValue: {type: GraphQLFloat},
        downPayment: {type: GraphQLFloat},
        loanPayment: {type: GraphQLFloat},
        monthlyMortgagePayment: {type: GraphQLFloat},
        creditScore: {type: GraphQLInt}
    }),
});

//Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    //Query fields which returns objects
    fields: () => ({
        id: {type: GraphQLID}, 
        name: {type: GraphQLString},
        description: {type: GraphQLString}, 
        status: {type: GraphQLString},
        client: {
            type: ClientType,
            resolve(parent, args) {
                return clients.findById(parent.clientId);
            }
        }
    }),
});
//To make a query by ID we need to make a root query object
// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //get all clients
        clients:{
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find();
            },
        },
        //return client based on ID
        client: {
            type: ClientType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args) {
                return Client.findById(args.id);
            },
        },
        //return all projects
        projects:{
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find();
            },
        },
        //return project based on ID
        project: {
            type: ProjectType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args) {
                return Project.findById(args.id);
            },
        },
    },
});

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      // Add a client
      addClient: {
        type: ClientType,
        args: {
            id: {type: GraphQLNonNull(GraphQLInt)}, 
            grossMonthlyIncome: {type: GraphQLNonNull(GraphQLFloat)},
            creditCardPayment: {type:GraphQLNonNull(GraphQLFloat)}, 
            carPayment: {type: GraphQLNonNull(GraphQLFloat)},
            studentLoanPayments: {type: GraphQLNonNull(GraphQLFloat)},
            appraisedValue: {type: GraphQLNonNull(GraphQLFloat)},
            downPayment: {type: GraphQLNonNull(GraphQLFloat)},
            loanPayment: {type: GraphQLNonNull(GraphQLFloat)},
            monthlyMortgagePayment: {type: GraphQLNonNull(GraphQLFloat)},
            creditScore: {type: GraphQLNonNull(GraphQLInt)}
        },
        resolve(parent, args) {
          const client = new Client({
            grossMonthlyIncome: args.grossMonthlyIncome,
            creditCardPayment: args.creditCardPayment,
            carPayment: args.carPayment,
            studentLoanPayments: args.studentLoanPayments,
            appraisedValue: args.appraisedValue,
            downPayment: args.downPayment,
            loanPayment: args.loanPayment,
            monthlyMortgagePayment: args.monthlyMortgagePayment,
            creditScore: args.creditScore,
          });
  
          return client.save();
        },
      },
      // Delete a client
      deleteClient: {
        type: ClientType,
        args: {
          id: { type: GraphQLNonNull(GraphQLID) },
        },
        resolve(parent, args) {
          Project.find({ clientId: args.id }).then((projects) => {
            projects.forEach((project) => {
              project.remove();
            });
          });
  
          return Client.findByIdAndRemove(args.id);
        },
      },
      // Add a project
      addProject: {
        type: ProjectType,
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          description: { type: GraphQLNonNull(GraphQLString) },
          status: {
            type: new GraphQLEnumType({
              name: 'ProjectStatus',
              values: {
                new: { value: 'Not Started' },
                progress: { value: 'In Progress' },
                completed: { value: 'Completed' },
              },
            }),
            defaultValue: 'Not Started',
          },
          clientId: { type: GraphQLNonNull(GraphQLID) },
        },
        resolve(parent, args) {
          const project = new Project({
            name: args.name,
            description: args.description,
            status: args.status,
            clientId: args.clientId,
          });
  
          return project.save();
        },
      },
      // Delete a project
      deleteProject: {
        type: ProjectType,
        args: {
          id: { type: GraphQLNonNull(GraphQLID) },
        },
        resolve(parent, args) {
          return Project.findByIdAndRemove(args.id);
        },
      },
      // Update a project
      updateProject: {
        type: ProjectType,
        args: {
          id: { type: GraphQLNonNull(GraphQLID) },
          name: { type: GraphQLString },
          description: { type: GraphQLString },
          status: {
            type: new GraphQLEnumType({
              name: 'ProjectStatusUpdate',
              values: {
                new: { value: 'Not Started' },
                progress: { value: 'In Progress' },
                completed: { value: 'Completed' },
              },
            }),
          },
        },
        resolve(parent, args) {
          return Project.findByIdAndUpdate(
            args.id,
            {
              $set: {
                name: args.name,
                description: args.description,
                status: args.status,
              },
            },
            { new: true }
          );
        },
      },
    },
  });
  
  module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
  });