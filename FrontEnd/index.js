const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector("#browseBtn");

const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");

const fileURLinput = document.querySelector("#fileURLinput");
const copyBtn = document.querySelector("#copyBtn");
const sharingContainer = document.querySelector(".sharing-container");
const emailForm = document.querySelector("#email-form")

const toast = document.querySelector(".toast");


console.log("hello");

console.log(Math.random()*100);

const host = "https://easyshare-1enk.onrender.com";//https://easyshare-1enk.onrender.com
const uploadURL = `${host}/api/files`;
const emailURL = `${host}/api/files/send`;

dropZone.addEventListener("dragover",(e)=>{
   e.preventDefault();

   if(!dropZone.classList.contains("dragged")){
      dropZone.classList.add("dragged");
   }
   
});

dropZone.addEventListener("dragleave",(e)=>{
  e.preventDefault();
  dropZone.classList.remove("dragged");
  
});
dropZone.addEventListener("drop",(e)=>{
  e.preventDefault();

  dropZone.classList.remove("dragged");
  //console.log(e);
  const file = e.dataTransfer.files;
  //console.log(file);
  if(file.length){
    fileInput.files = file;
    console.log(file);
    
    uploadFile();
  }
});

fileInput.addEventListener("change",()=>{
      uploadFile();
});
browseBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    fileInput.click();
})
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(fileURLinput.value).then(() => {
    showToast("Link copied");
  }).catch(err => {
    showToast(`Failed to copy ${err}`);
  });
});
const uploadFile = () => {

  const file = fileInput.files;
  if(file.length>1){
    fileInput.value="";
    showToast("Only upload 1 file!")
    return;
  }
  if(file[0].size > 100*1024*1024){
    fileInput.value="";
    showToast("Can't upload more than 100 MB file!!")
  }
  progressContainer.style.display = "block";
  console.log("file added uploading");

  
  console.log(file);
  const formData = new FormData();
  formData.append("myfile", file[0]);

  progressContainer.style.display = "block";

  const xhr = new XMLHttpRequest();

  xhr.onprogress = updateProgress;

  xhr.upload.onerror = function () {
     // reset the input
    fileInput.value = "";
    showToast(`Error in upload: ${xhr.statusText}.`);
    
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      try {
        const response = JSON.parse(xhr.responseText);
        onUploadSuccess(response);
        // Process the response
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
    }
  };

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};



const updateProgress = (event) => {
  if (event.lengthComputable) {
    const percent = Math.round((event.loaded * 100) / event.total);
    //console.log(`Loaded: ${event.loaded}, Total: ${event.total}, Percent: ${percent}%`);
    
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent/100})`;
  } else {
    console.warn("Progress event is not computable");
  }
};

const onUploadSuccess = ({file:url})=>{
  fileURLinput.value=url;
  emailForm[2].removeAttribute("disabled");
  fileInput.value="";
  sharingContainer.style.display="block"
  progressContainer.style.display="none"
}

emailForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const url = fileURLinput.value;
  const formData = {
     uuid:url.split("/").splice(-1,1)[0],
     emailTo :emailForm.elements["to-email"].value,
     emailFrom:emailForm.elements["from-email"].value,
  }
  emailForm[2].setAttribute("disabled","true");
  console.table(formData);
  fetch(emailURL,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(formData)
  }).then(res => res.json()).then(({success}) =>{
      if(success){
        sharingContainer.style.display="none";
        showToast("Email sent")
      }
    
  });
});

const showToast = (msg)=>{
  toast.innerText = msg;
  toast.style.transform = "translate(-50%,0)"
  clearTimeout(toastTimer);
  var toastTimer = setTimeout(() => {
    toast.style.transform = "translate(-50%,100px)"
  }, 2000);
}


