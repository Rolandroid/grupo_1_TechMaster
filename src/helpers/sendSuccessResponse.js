module.exports = (res,{data,...props } ={})  =>{ //data si o si existe y props representa  aun re.params, es decir, todas las propiedades que se agreguen va despues de data
    // a las ...prop se le puede agregar = {} un obj vacio para que no rompa el code si no viene ninguna prop, si no existen
    res.status(200).json({ok:true, data,...props});

}