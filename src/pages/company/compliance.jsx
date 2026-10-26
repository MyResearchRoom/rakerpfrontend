import UploadDocumentPage from '../../components/feature/AdminAndEmployee/compliance/uploadDocumentPage';
import CompanyCompliance from '../../pages/company/compliance';
import { useSelector } from "react-redux";

export default function Compliance() {
  const { role } = useSelector((state) => state.auth);

  if (role === "COMPANY") {
    return <UploadDocumentPage />;
  }

  return <CompanyCompliance />;
}