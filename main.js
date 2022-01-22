const apiUrl = 'http://localhost:5000/api/';
var jobFormFileId = null;

// Form
async function submitForm() {
    if(validateForm()) {
        var jobTitle = document.getElementById("job-title");
        var jobCountry = document.getElementById("job-countries");
        var jobProvince = document.getElementById("job-provinces");
        var jobAdditionalInfo = document.getElementById("job-additional-info");

        const response = await fetch(apiUrl + 'jobForm/', {
            method: 'POST',
            body: JSON.stringify({title: jobTitle.value, countryId: jobCountry.value, provinceId: jobProvince.value,
            additionalInfo: jobAdditionalInfo.value || null, jobFormFileId: jobFormFileId || null}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if(response.status == 200) {
            var jobForm = document.getElementById("job-form");
            var successMessage = document.getElementById("success-message");
            jobForm.hidden = true;
            successMessage.hidden = false;
        }
    }
}

function validateForm() {
    var isValid = true;
    var jobTitle = document.getElementById("job-title");
    var jobCountry = document.getElementById("job-countries");
    var jobProvince = document.getElementById("job-provinces");
    var jobAdditionalInfo = document.getElementById("job-additional-info");

    console.log(jobTitle.value.length);

    // Check for required
    if(jobTitle.value == null || jobTitle.value === '') {
        var jobTitleError = document.getElementById("job-title-error");
        jobTitle.classList.add("input-error");
        jobTitleError.hidden = false;
        jobTitleError.innerHTML = "Job title is a required field."
        isValid = false;
    }

    if(jobCountry.value == null || jobCountry.value === '') {
        isValid = false;
    }

    if(jobProvince.value == null || jobProvince.value === '') {
        isValid = false;

    }

    // Check length
    if(jobTitle.value.length < 3 || jobTitle.value.length > 125) {
        var jobTitleError = document.getElementById("job-title-error");
        jobTitle.classList.add("input-error");
        jobTitleError.hidden = false;
        jobTitleError.innerHTML = "Job title is too long or too short"
        isValid = false;
    }

    if(jobAdditionalInfo.value.length > 550) {
        var jobAdditionalInfoError = document.getElementById("job-additional-info-error");
        jobAdditionalInfo.classList.add("input-error");
        jobAdditionalInfoError.hidden = false;
        jobAdditionalInfoError.innerHTML = "Job appilcation info is too long"
        isValid = false;
    }

    return isValid;
}

async function uploadFile() {
    var jobFormFile = document.getElementById("job-file-input").files[0];
    var jobFormFileLabel = document.getElementById("file-name");

    let formData = new FormData();
    formData.append("file", jobFormFile);

    if(jobFormFile) {
        jobFormFileLabel.innerHTML = jobFormFile.name;

        console.log(jobFormFile);

        const response = await fetch(apiUrl + 'jobFormFile/', {
            method: 'POST',
            body: JSON.stringify({file: formData, fileType: jobFormFile.type}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();
        jobFormFileId = myJson.id;
    }
}

function updateWordCount(reset) {
    console.log("triggered")
    var wordCount = document.getElementById("word-count");

    if(reset) {
        wordCount.innerHTML = 0;
        wordCount.hidden = true;
        return;
    }

    var jobAdditionalInfo = document.getElementById("job-additional-info");
    wordCount.hidden = false;
    wordCount.innerHTML = jobAdditionalInfo.value.length;
}

function resetForm() {
    var jobTitleError = document.getElementById("job-title-error");
    var jobTitle = document.getElementById("job-title");
    var jobAdditionalInfoError = document.getElementById("job-additional-info-error");
    var jobAdditionalInfo = document.getElementById("job-additional-info");

    jobTitle.classList.remove("input-error");
    jobTitleError.hidden = true;

    jobAdditionalInfo.classList.remove("input-error");
    jobAdditionalInfoError.hidden = true;

    jobFormFileId = null;

    updateWordCount(true);
}

// Dropdown Data
async function getCountries() {
    const response = await fetch(apiUrl + 'countries');
    const myJson = await response.json();
    return myJson;
}

async function getProvinces(countryId) {
    const response = await fetch(apiUrl + 'provinces/?'+ new URLSearchParams({
        countryId: countryId
    }));
    const myJson = await response.json();
    return myJson;
}

async function setDropdownData() {
    var canada;

    countries = await getCountries();

    var countryDropdown = document.getElementById("job-countries");

    countries.forEach( country => {
        var option = document.createElement("OPTION");
        option.text = country.name;
        option.value = country.id;
        countryDropdown.add(option);

       if(country.name === "Canada") {
           canada = country;
       }
    });

    countryDropdown.value = canada.id;
    setProvinceDropdownData(canada.id);
}

async function onCountryChange() {
    var countryDropdown = document.getElementById("job-countries");
    setProvinceDropdownData(countryDropdown.value);

}

async function setProvinceDropdownData(countryId) {
    var provinceDropdown = document.getElementById("job-provinces");
    removeOptions(provinceDropdown);

    provinces = await getProvinces(countryId);

    provinces.forEach( province => {
        var option = document.createElement("OPTION");
        option.text = province.name;
        option.value = province.id;
        provinceDropdown.add(option);
    });
}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

setDropdownData();
