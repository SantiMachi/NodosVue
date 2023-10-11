const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL|| 'postgres://postgres:ProyectoJhin1@localhost:5433/Grafos',
    ssl: process.env.DATABASE_URL ? true : false
})



const getUsers = async (req,res)=>{
    try
    {
        const response = await pool.query('SELECT * FROM nodos');
        res.status(200).json(response.rows);
    }
    catch(error){
        console.log(error);
        res.send("Error: "+error);
    }
};


const getUserById = async(req,res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM nodos WHERE id = $1',[id]);
    res.json(response.rows);
};

const createUser = async (req,res)=>{
    const {nombre, posicion_x, posicion_y} = req.body;
    const response = await pool.query('INSERT INTO nodos(nombre, posicion_x, posicion_y) VALUES($1, $2, $3)',[nombre, posicion_x, posicion_y]);
    console.log(response);
    res.json({
        message: 'User Added Successfully',
        body:{
            user:{nombre, posicion_x, posicion_y}
        }
    });
};


const deleteUser = async(req,res) =>{
    const id = req.params.id;
    const response = await pool.query('DELETE FROM nodos WHERE id = $1',[id]);
    console.log(response);
    res.json(`User ${id} deleted successfully`);
};

const deleteFix = async(req,res) =>{
    const response = await pool.query('DELETE FROM nodos');
    console.log(response);
    res.json(`User deleted successfully`);
};

const updateUser = async(req,res) => {
    const id = req.params.id;
    const {nombre, posicion_x, posicion_y} = req.body;
    const response = await pool.query('UPDATE nodos SET nombre =$2, posicion_x =$3, posicion_y =$4 WHERE id = $1',[id,nombre, posicion_x, posicion_y]);
    console.log(response);
    res.json('User updated successfully');
};

const getEnlaces = async (req,res)=>{
    try
    {
        const response = await pool.query('SELECT * from enlaces');
        res.status(200).json(response.rows);
    }
    catch(error){
        console.log(error);
        res.send("Error: "+error);
    }
};


const getEnlaceById = async(req,res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM enlaces WHERE id = $1',[id]);
    res.json(response.rows);
};

const createEnlace = async (req,res)=>{
    const {nodo_inicio_id, nodo_fin_id, valor_numerico} = req.body;
    const response = await pool.query('INSERT INTO enlaces (nodo_inicio_id, nodo_fin_id, valor_numerico) VALUES($1, $2, $3)',[nodo_inicio_id, nodo_fin_id, valor_numerico]);
    console.log(response);
    res.json({
        message: 'enlace Added Successfully',
        body:{
            Charla:{nodo_inicio_id, nodo_fin_id, valor_numerico}
        }
    });
};

const deleteEnlace = async(req,res) =>{
    const id = req.params.id;
    const response = await pool.query('DELETE FROM enlaces WHERE id = $1',[id]);
    console.log(response);
    res.json(`enlace ${id} deleted successfully`);
};

const updateEnlace = async(req,res) => {
    const id = req.params.id;
    const {nodo_inicio_id, nodo_fin_id, valor_numerico} = req.body;
    const response = await pool.query('UPDATE enlaces SET nodo_inicio_id =$2, nodo_fin_id =$3, valor_numerico =$4 WHERE id = $1',[id, nodo_inicio_id, nodo_fin_id, valor_numerico]);
    console.log(response);
    res.json('enlace updated successfully');
};


module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    deleteFix,
    updateUser,
    getEnlaces,
    getEnlaceById,
    createEnlace,
    deleteEnlace,
    updateEnlace,
}