require('dotenv').config();
const port = 3000;
const { ApolloServer , gql }  = require('apollo-server')

const users = [
    {"id": 11,"fullname": "Ali Ahmed", "email": "ali@gmail.com","dob":"17/06/1999"},
    {"id": 22,"fullname": "Mahmoud Ahmed", "email": "mahmoud@gmail.com","dob":"14/02/1991"},
    {"id": 33,"fullname": "Saeed Mahmoud", "email": "saeed@gmail.com","dob":"11/11/1993"},
    {"id": 44,"fullname": "Ahmed Mahmoud", "email": "ahmed@gmail.com","dob":"05/12/1996"},
    {"id": 55,"fullname": "Kamal Saeed", "email": "kamal@gmail.com","dob":"03/01/1997"},
]
const articles = [
    {"id": 1, "authorId":11, "title": "How to handle state in React. The missing FAQ.","content":"Recently there has been a lot of debate about how to manage the state in React. Some claim that setState() doesn’t work as you might expect."},
    {"id": 2, "authorId":33, "title": "You might not need React Router","content":"Lorem ipsum dolor sit amet consectetur, adipiscing elit vestibulum."},
    {"id": 3, "authorId":22, "title": "Mixins Considered Harmful","content":"At Facebook, React usage has grown from a few components to thousands of them. This gives us a window into how people use React. "},
    {"id": 4, "authorId":55, "title": "React Design Principles","content":"In general we resist adding features that can be implemented in userland. We don’t want to bloat your apps with useless library code. However, there are exceptions to this."},
    {"id": 5, "authorId":44, "title": "Don't use .bind() when passing props","content":"There are many situations when writing React where you’ll want to pass a function to a prop."},
]
const comments = [
    {"title": "This is some awesome thinking","articleId":5,"content": "Lorem ipsum dolor sit amet consectetur, adipiscing elit luctus."},
    {"title": "What terrific math skills you’re showing!","articleId":3, "content": "Lorem ipsum dolor sit amet consectetur, adipiscing elit luctus."},
    {"title": "You are an amazing writer!","articleId":2, "content": "Lorem ipsum dolor sit amet consectetur, adipiscing elit luctus."},
    {"title": "Wow! You have improved so much!","articleId":1,"content": "Lorem ipsum dolor sit amet consectetur, adipiscing elit luctus."},
    {"title": "Nice idea!", "articleId":2, "content": "Lorem ipsum dolor sit amet consectetur, adipiscing elit luctus."},
]
// Article (id, title, content)
// User (fullname, email, dob)
// Comment (title, content)

//SDL Version

const typeDefs = gql`
    type Article {
        id:Int!,
        title:String!,
        content:String!,
        authorId:Int,
        users:[User],
        comment:[Comment]
    }
    type User {
        id:Int!,
        fullname:String!,
        email:String!,
        dob:String,
    }
    type Comment {
        title:String!,
        content:String!,
        articleId:Int!
    }
    input userInput {
        id:Int
    }
    input createInput{
        id:Int!,
        title:String!,
        content:String!,
    }
    type Query {
        user:User,
        article:Article,
        comment:Comment,
        allArticalsById (input:userInput):Article,
        Articles:[Article]
    }
    # Add mutation to create Article
    type Mutation {
        createArticle(input:createInput):[Article]  
    }
`

//Resolvers 

const resolvers = {
    Mutation:{
        createArticle: (_,args)=>{
            articles.push(args.input)
            return articles
        }
    },
    Query:{
        //2. fetch article by its id
        allArticalsById:(_,args) => {
            const article = articles.find((article)=>article.id == args.input.id)
            return article
        },
        Articles:() => articles,

    },
    //1. fetch the articles including their comments and including the articles' author
    Article:{
        users: article => {
            const articleComments = comments.filter(comment => comment.articleId == article.id)
            article.comment = articleComments
            const Author = users.filter(user=> ( (user.id == article.authorId)))
            return Author
        }
    }
}



const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        if(req.headers.authorization !== "auth-lab2-value"){
            throw new Error("Unauthorized access ")
        }
    }
})
server.listen(port,()=>{
    console.log(`Apollo Server is running http://localhost:${port}`)
})
/*
1. fetch the articles including their comments and including the articles' author
query {
  Articles {
    id
    title
    content
    authorId
    users {
      fullname
    }
    comment {
      title
      content
    }
  }
}
*/
/*
2. fetch article by its id
query{
  allArticalsById (input: {id:3}){
    id
    title
    content
    authorId
    users {
      fullname
    }
    comment {
      title
      content
    }
  }
}
*/
/*
Add mutation to create Article
mutation{
  createArticle (input: {id:8,title:"New title 8", content:"New Content 8"}){
    id,
    title,
    content
  }
}
*/