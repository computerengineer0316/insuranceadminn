import axios from "axios";

export const handlePdfDownload = async (query, Filename) => {
    // Convert the Base64 data to a blob
    try {
        axios.post(`https://insuranceapi-3o5t.onrender.com/api/generatePdf`, {
            "Filename": Filename,
            url: query
        }, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        }
        ).then((response) => {
            console.log(response)
            const todaydate = new Date().toISOString().slice(0, 10);
            const base64Data = response.data.data && response.data.data
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });

            // Create a URL for the blob and set it as the href of the anchor tag
            const blobUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = Filename + "-" + todaydate + "-" + ".pdf";

            // Programmatically trigger a click on the anchor to start the download
            anchor.click();

            // Clean up resources
            URL.revokeObjectURL(blobUrl);
        }).catch((error) => {
            console.log(error)
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message)
            } else {
                alert(error.message)
            }
        })



    } catch (error) {
        console.log(error)
    }
};
// / print  html data from html content from axios call
export const handlePrint = async (query, Filename) => {
    // Convert the Base64 data to a blob
    try {
        axios.post(`https://insuranceapi-3o5t.onrender.com/api/PrintPdf`, {
            "Filename": Filename,
            url: query
        }, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        }
        ).then((response) => {
            const htmlContent = response.data.data && response.data.data
            // Create a new window and write the HTML content
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.open();
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            // Trigger the print dialog
            printWindow.focus();
            printWindow.print();
        }).catch((error) => {
            console.log(error)
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message)
            } else {
                return;
            }
        })
    } catch (error) {
        console.log(error)
    }
}

