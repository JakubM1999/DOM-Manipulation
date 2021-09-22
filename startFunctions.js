/* Screen Loader */
const loader = document.querySelector(".loader");
const loaderBackground = document.querySelector(".holy_wrapper");

window.onload = () => {
    setTimeout(function()
    {loader.style.opacity = "0", 
    loaderBackground.style.display = "block";}, 1500);  

}

/* Button Click */
const buttonClick = document.querySelector(".button2")

const clickFunction = (e) => {
    const clickedElement = e.target;

    clickedElement.style.backgroundColor = "white";
    clickedElement.style.borderRadius = "10px"
    clickedElement.style.color = "#202020"
}

buttonClick.addEventListener("click", clickFunction);

