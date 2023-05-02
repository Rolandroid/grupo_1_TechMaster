
const inputs = document.querySelectorAll('.commentList');

for(let input of inputs){
    input.addEventListener('change', () => {
        console.log(input.id);
        console.log(input.checked); 

    })
}