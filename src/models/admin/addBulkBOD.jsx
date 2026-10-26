import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { addBuldBoardOfDirector } from "../../services/boardOfDirector";
import { Download, Sheet, Upload } from "lucide-react";
const AddBulkBoardDirectorModal = ({ isOpen, onClose, id }) => {
    const fileRef = useRef();
    const handleFileClick = () => {
        fileRef.current.click();
    };
    
    const [loadingUpload,setLoadingUpload]=useState(false);
    const [excelFile,setExcelFile]=useState(null);

    const[responseData,setResponseData] =useState({});

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setResponseData({});

      const validExtensions = [".xlsx", ".csv"];
      const validTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/csv",
      ];

      const isValidExtension = validExtensions.some(ext =>
          file.name.toLowerCase().endsWith(ext)
      );

      const isValidType = validTypes.includes(file.type);

      if (!isValidExtension || !isValidType) {
          toast.error("Please upload only .xlsx or .csv file");
          return;
      }

      setExcelFile(file);
    };

    const handleFileUpload =async()=>{
    
        if(!excelFile){
            return toast.error("Please upload file first and then submit");
        }
        try {
            setLoadingUpload(true);
            const payload=new FormData();
            if (excelFile) payload.append("file", excelFile);
            const response = await addBuldBoardOfDirector(payload,id);
            if(response){
                toast.success(response?.message || "BOD added..")
                console.log("response",response);
                setResponseData(response?.data);
                setExcelFile(null);
            }
            else{
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error(error);
        }finally {
            setLoadingUpload(false);
        }
    }

    if (!isOpen || !id) return null;

    return(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-[50%] rounded-lg p-5 shadow-lg relative min-h-[40vh] overflow-y-auto no-scrollbar flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between gap-5 mb-5 border-b border-gray-400 pb-2">
            <h2 className="text-lg font-bold text-black">
                Add Bulk Board of Directors
            </h2>
            <button
                className="text-black text-lg"
                onClick={onClose}
            >
                ✕
            </button>
        </div>

        <div className="font-semibold ml-auto pb-5">
          <button 
            className='text-white bg-green-500 flex flex-row gap-2 items-center p-2 md:px-4 border border-green-600 rounded-md'
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/template/BOD_Template.csv";
              link.download = "BOD_Template.csv";
              link.click();
            }}
          >   
            <Download className='w-4 h-4' />
            <p className='text-xs md:text-sm'>Download Excel Template</p>
          </button>
        </div>

        <div className="border border-blue-300 bg-blue-50 p-5 rounded-lg flex flex-col gap-2 mb-5">
              
              <div className="flex flex-col md:flex-row items-start gap-5 justify-between border-b-2 pb-3 border-dashed border-gray-500">
                  
                  <div className="space-y-1">
                      <h2 className="text-sm md:text-base font-semibold mb-1">Bulk Import via Excel</h2>
                      <h2 className="text-xs md:text-sm font-semibold text-gray-700">
                          Download the template, fill director details, and upload to add multiple directors at once.
                      </h2>
                  </div>
                  
              </div>
              

              <div className='flex flex-col md:flex-row gap-3 text-black font-semibold pt-4 md:pt-6'>
                  <div className='bg-white flex flex-row gap-2 items-center p-2 md:px-4 border border-gray-300 rounded-md'>
                      <input
                      type="file"
                      ref={fileRef}
                      className="hidden"
                      accept=".xlsx,.csv"
                      onChange={handleFileChange}
                      />

                      <button
                          type="button"
                          onClick={handleFileClick}
                          className="flex flex-row gap-2 items-center "
                          >
                          {excelFile ? (
                          <div className='flex flex-row gap-2 items-center'>
                              <Sheet className="w-4 h-4 text-green-600" />
                              <p className='text-xs md:text-sm text-green-600'>{excelFile.name}</p>
                          </div>
                              
                          ) : (
                          <div className='flex flex-row gap-2 items-center'>
                              <Upload className="w-4 h-4" />
                              <p className="text-xs md:text-sm">
                              Upload Excel File (.xlsx / .csv)
                              </p>
                          </div>
                          ) }
                      
                      </button>
                  </div>

                  <button
                      type="button" 
                      className="bg-blue-600 flex items-center p-2 md:px-4 rounded-md text-white"
                      onClick={handleFileUpload}
                  >
                      {loadingUpload ? "Submitting...." : "Submit"}
                  </button>
              </div>
        </div>

        {responseData && Object.keys(responseData).length > 0 && (
        <div className="text-green-500">
          <p>Total records uploaded: {responseData?.totalRows ?? 0}</p>
          <p>Successfully inserted: {responseData?.insertedRows ?? 0}</p>
          <p>Skipped Rows: {responseData?.skippedRows ?? 0}</p>
          <p>Duplicates in file: {responseData?.duplicateInExcel ?? 0}</p>
          <p>Already existing records: {responseData?.duplicateInDB ?? 0}</p>
        </div>
        )}

      </div>

    </div>
    );

}

export default AddBulkBoardDirectorModal;