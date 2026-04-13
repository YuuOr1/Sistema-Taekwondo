console.log("nuevo js cargado");

const tipos = {
    1: "text",     // nombre
    2: "date",     // fecha nacimiento
    3: "number",   // edad
    4: "date",     // fecha ingreso
    5: "date",     // último examen
    6: "text",     // cinta actual (luego puedes mejorar a select)
    7: "text",     // próxima cinta
    8: "text"      // empresa
};

document.addEventListener('click', function(event){

    const botonEditar = event.target.closest('.btn-table-edit');
    const botonConfirmar = event.target.closest('.btn-confirmar')

    if (botonEditar){
        const id = botonEditar.dataset.id; // Se obtiene el id del boton editar seleccionado
        
        const fila = botonEditar.closest('tr');
        const celdas = fila.querySelectorAll('td');

        celdas.forEach((celda, index) => {
            if(index === 0 || index === celdas.length - 1) return;

            const texto = celda.textContent;
            const tipo = tipos[index] || "text";

            celda.innerHTML = `<input type="${tipo}" value="${texto}">`;
            
        });

        botonEditar.textContent = "Confirmar";
        botonEditar.classList.remove('btn-table-edit');
        botonEditar.classList.add('btn-confirmar');
    }

    if(botonConfirmar){
        const fila = botonConfirmar.closest('tr');
        const celdas = fila.querySelectorAll('td');

        celdas.forEach((celda, index) => {
            if(index === 0 || index === celdas.length - 1) return;

            const input = celda.querySelector('input');
            const valor = input.value

            celda.textContent = valor;
        });

        botonConfirmar.textContent = "Editar";
        botonConfirmar.classList.remove('btn-confirmar');
        botonConfirmar.classList.add('btn-table-edit');
    }
});