const searchForm = document.querySelector(".search-box form");
const employeeCard = document.querySelector(".card");
const employeeHead = document.querySelector(".employee-heading");

searchForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default form submission behavior

  const employeeId = document.querySelector('input[name="employee"]').value;

  // Make an AJAX request to your Node.js server endpoint here
  // (using fetch or a library like Axios)
  fetch("https://www.newtownlog.com/getemployee?id=" + employeeId)
    .then(response => response.json())
    .then(data => {
      // Update employee card content with retrieved data
      employeeCard.innerHTML = `
        <img src="/w3images/team2.jpg" alt="photo" style="width:100%">
        <h1>${data.name}</h1>
        <p class="title">Email: ${data.email}</p>
        <p class="title">Age: ${data.age}</p>
        <p class="title">Title: ${data.title}</p>
        <p class="title">Phone: ${data.phonenum}</p>
        <p class="title">Years of Experience: ${data.yearsofexp}</p>
        <p class="title">Wage($): ${data.wage}</p>
        <p class="title">Length of contract(weeks): ${data.lenofcontract}</p>
      `;
      employeeCard.style.display = "block";
      employeeHead.style.display = "block";
    })
    .catch(error => {
      console.error("Error fetching employee info:", error);
      // Handle errors appropriately (e.g., display an error message)
    });
});