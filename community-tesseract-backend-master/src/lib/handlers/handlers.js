const Express = require("express");
const { getDBHandler } = require("../db");

const RequestHandler = Express.Router();

RequestHandler.get("/to-dos",async (request,response)=>{
    try {
       //throw Error("sample Error");
    const dbHandler = await getDBHandler();
    
    const todos = await dbHandler.all("select * from todos");
    if(!todos || !todos.length){
        response.status(404).send({message : "todos not found"}).end();
    }



    dbHandler.close();
    response.send({todos});
    } catch (error) {
        response.status(500).send({
            error: `something went wrong when trying to get the to dos list`,
            errorInfo:error.message,
        });
    }

});

RequestHandler.post("/to-dos", async (request, response) => {
    try {
      const { title, description, isDone: is_done } = request.body;
  
      const dbHandler = await getDBHandler();
      const newTodo = await dbHandler.run(
        `INSERT INTO todos (title, description, is_done) 
         VALUES (
            '${title}',
            '${description}',
            ${is_done}
         )`
      );
      
      await dbHandler.close();
  
      response.send({
       newTodo
      });
       


    } catch (error) {
        response.status(500).send({
            error: `something went wrong when trying to create the to dos list`,
            errorInfo:error.message,
        });
    }

});

RequestHandler.patch("/to-dos/:id",async (request,response)=>{
    try {
     const todoId = request.params.id;
     const dbHandler = await getDBHandler();
     const { title, description, isDone: is_done} = request.body;
     
     const todoToUpdate = await dbHandler.get(
    "select * from todos where id = ?", todoId);

    
    if(todoToUpdate === undefined){
        await dbHandler.close();
        return response.status(404).send({message : "todo not found"});
    }


    console.log(todoId);
    console.log(todoToUpdate);

    const updatedTodo = await dbHandler.run(
        `UPDATE todos SET title = ?, description =?, is_done=? WHERE id= ?`, title || 
        todoToUpdate.title, description || 
        todoToUpdate.description, is_done ||
        todoToUpdate.is_done, todoId
    ); 

    

    
    await dbHandler.close();
    response.send({updatedTodo});
    } catch (error) {
        response.status(500).send({
            error: `something went wrong when trying to update the to dos list`,
            errorInfo:error.message,
        });
    }

});

RequestHandler.delete("/to-dos/:id?",async (request,response)=>{
   
    try {
        const todoId =request.params.id;
        const dbHandler = await getDBHandler()       

        
            const deletedTodo =await dbHandler.run(
                "DELETE FROM todos Where id = ?", todoId    
            );

            if(deletedTodo.changes != 1){
                await dbHandler.close();
                return response.status(404).send({message : "todo not found"});
            }

    
            await dbHandler.close();
            response.send({todoRemoved:{...deletedTodo}});      
        
        
    } catch (error) {
        response.status(500).send({
            error: `something went wrong when trying to delete the to dos list`,
            errorInfo:error.message,
        });
    }

});

module.exports = RequestHandler;