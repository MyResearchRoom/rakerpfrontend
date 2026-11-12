import React, { useState } from "react";

/* ----------------- Shared style tokens (design only) ----------------- */
const sectionTitle =
  "mt-7 mb-2 border-l-4 border-blue-800 pl-3 text-[17px] font-semibold text-slate-900";
const para = "mb-4 text-[14px] leading-relaxed text-slate-600";
const paraTight = "mb-2 text-[14px] leading-relaxed text-slate-600";
const list =
  "mb-5 list-disc space-y-1.5 pl-6 text-[14px] leading-relaxed text-slate-600 marker:text-blue-800 [&_strong]:font-semibold [&_strong]:text-slate-800";

const TermsCondition = ({ onAccept, loading = false }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((checked) => !checked);
  };

  const handleAccept = () => {
    if (isChecked && !loading) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6">
      <div className="mx-auto flex max-h-[92vh] w-[92%] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl lg:w-[60%]">
        {/* ----------------- Header ----------------- */}
        <div className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-[20px] font-semibold text-slate-900">
            Terms & Conditions
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Please read through the terms below before accessing the RAK ERP
            Admin Panel.
          </p>
        </div>

        {/* ----------------- Scrollable content ----------------- */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
          {/* ----------------- Introduction ----------------- */}

          <p className={para}>
            Welcome to the RAK ERP Admin Panel, operated under the RAK Advisory
            platform ("Company", "we", "us", or "our"). This platform is
            designed to facilitate the registration, management, maintenance,
            verification and administration of company-related information
            through a centralized digital system.
            <br />
            By accessing or using the RAK ERP Admin Panel, you ("User",
            "you", or "your") acknowledge that you have read, understood and
            agreed to comply with these Terms & Conditions. These terms govern
            your access to and use of the platform and the information,
            documents and records maintained through it.
          </p>

          <p className={para}>
            The platform enables users to create and maintain company profiles
            and manage information relating to company identification,
            financial and compliance details, company officials, membership
            information, share capital, infrastructure and assets, business
            activities, licenses and registrations, equipment, statutory
            auditors and supporting documents.
          </p>

          <p className={para}>
            Please read these Terms & Conditions carefully before proceeding.
            Your acceptance confirms your consent to the collection, storage,
            processing and authorized use of the information you provide
            through the platform for legitimate business, administrative and
            operational purposes.
          </p>

          {/* ----------------- Consent and Authorization ----------------- */}

          <h2 className={sectionTitle}>1. Consent and Authorization</h2>

          <p className={para}>
            By registering, accessing or using the RAK ERP Admin Panel, you
            voluntarily consent to the collection, recording, storage,
            processing and use of the information submitted by you or your
            organization through the platform.
            <br />
            You confirm that you are authorized to provide the company
            information, documents and other details submitted through your
            account. Where you are acting on behalf of a company or another
            individual, you represent that you have the necessary authority
            and permission to submit such information and accept these terms
            on their behalf.
            <br />
            Your consent is limited to the purposes described in these Terms
            & Conditions and applicable legal requirements. We will not
            knowingly use the information for unrelated or unauthorized
            purposes.
          </p>

          {/* ----------------- Information Collected ----------------- */}

          <h2 className={sectionTitle}>2. Collection of Company Information</h2>

          <p className={paraTight}>
            To provide the platform's company management and administrative
            functionalities, we may collect and process information submitted
            by authorized users, including but not limited to:
          </p>

          <ul className={list}>
            <li>
              <strong>Company Profile:</strong> Company name, unique company
              code, registered address, contact information and general
              company details.
            </li>
            <li>
              <strong>Company Identification:</strong> Registration
              certificates, incorporation details, identification numbers and
              other relevant company identification records.
            </li>
            <li>
              <strong>Financial & Compliance Information:</strong> Financial
              statements, capital details, tax-related information, statutory
              records and other relevant compliance information.
            </li>
            <li>
              <strong>Company Officials:</strong> Details of directors,
              authorized representatives, partners, key personnel and other
              individuals associated with the company.
            </li>
            <li>
              <strong>Membership & Share Capital:</strong> Membership
              information, shareholder details, ownership records and share
              capital information.
            </li>
            <li>
              <strong>Infrastructure & Assets:</strong> Details of company
              infrastructure, properties, facilities, assets and related
              supporting information.
            </li>
            <li>
              <strong>Business Activities:</strong> Information relating to
              the company's business operations, activities and areas of
              operation.
            </li>
            <li>
              <strong>Licenses & Registrations:</strong> Business licenses,
              statutory registrations, permits and other regulatory
              documentation.
            </li>
            <li>
              <strong>Equipment & Documents:</strong> Equipment details,
              statutory auditor information, supporting certificates and
              documents uploaded to the platform.
            </li>
            <li>
              <strong>User Information:</strong> Name, email address, contact
              details, account credentials and other information necessary
              for user registration and account administration.
            </li>
          </ul>

          <p className={para}>
            You acknowledge that some of the information submitted may
            contain confidential business, financial or personal information.
            You are responsible for ensuring that you have the necessary
            authorization and lawful basis to provide such information.
          </p>

          {/* ----------------- Purpose of Information Usage ----------------- */}

          <h2 className={sectionTitle}>3. Purpose of Information Usage</h2>

          <p className={paraTight}>
            The information collected through the RAK ERP Admin Panel will
            be used strictly for legitimate platform-related, business and
            administrative purposes, including:
          </p>

          <ul className={list}>
            <li>Creating, maintaining and updating company profiles.</li>
            <li>
              Verifying company details, identification records and uploaded
              supporting documents.
            </li>
            <li>
              Managing company financial, statutory and compliance-related
              information.
            </li>
            <li>
              Maintaining records of company officials, shareholders,
              memberships and ownership details.
            </li>
            <li>
              Managing company assets, infrastructure, equipment and business
              activities.
            </li>
            <li>Generating reports, summaries and administrative records.</li>
            <li>
              Facilitating internal reviews, verification and authorized
              business operations.
            </li>
            <li>
              Communicating important updates, notifications and
              account-related information.
            </li>
            <li>
              Maintaining platform functionality, improving services and
              ensuring system security.
            </li>
            <li>
              Complying with applicable laws, regulations and legitimate
              requests from authorized authorities.
            </li>
          </ul>

          <p className={para}>
            We do not intend to use company information for personal gain,
            unauthorized commercial activities or purposes unrelated to the
            functioning and legitimate operations of the platform.
          </p>

          {/* ----------------- Accuracy of Information ----------------- */}

          <h2 className={sectionTitle}>
            4. Accuracy and Authenticity of Information
          </h2>

          <p className={para}>
            Users are responsible for ensuring that all information,
            documents, declarations and records submitted through the
            platform are accurate, complete, genuine and up to date.
            <br />
            You must not knowingly submit false, misleading, fabricated,
            manipulated or unauthorized information or documents. Any
            changes to company details, financial information, statutory
            records or other submitted information should be updated
            promptly.
            <br />
            RAK Advisory reserves the right to review, request clarification
            or supporting documents, flag inconsistencies and restrict
            access to information where inaccurate, suspicious or
            unauthorized submissions are identified.
            <br />
            The responsibility for the correctness and authenticity of
            information provided remains with the user or the authorized
            company representative submitting it.
          </p>

          {/* ----------------- Confidentiality and Non-Misuse ----------------- */}

          <h2 className={sectionTitle}>
            5. Confidentiality and Non-Misuse of Information
          </h2>

          <p className={paraTight}>
            We recognize that company information, financial records,
            identification documents and other business-related data may be
            confidential. Such information must be handled responsibly and
            used only for the purposes authorized under these Terms &
            Conditions.
          </p>

          <ul className={list}>
            <li>
              Company information shall not be used for personal benefit,
              unauthorized commercial activities or any unrelated purpose.
            </li>
            <li>
              Users must not copy, download, disclose, distribute or share
              confidential company information with unauthorized persons.
            </li>
            <li>
              Users must not manipulate, alter, falsify, misuse or
              intentionally damage company records or uploaded documents.
            </li>
            <li>
              Information belonging to one company must not be accessed or
              used for another company's purposes without proper
              authorization.
            </li>
            <li>
              Users must not attempt to access restricted information,
              unauthorized accounts or confidential platform records.
            </li>
            <li>
              The platform must not be used for fraudulent, unlawful,
              misleading or harmful activities.
            </li>
            <li>
              Any suspected unauthorized access, data misuse or disclosure
              must be reported to the appropriate platform administrator
              without unnecessary delay.
            </li>
          </ul>

          <p className={para}>
            We will take reasonable steps to protect information entrusted
            to the platform and expect all users to maintain confidentiality
            and exercise appropriate care when handling company records.
          </p>

          {/* ----------------- Data Sharing ----------------- */}

          <h2 className={sectionTitle}>
            6. Sharing and Disclosure of Information
          </h2>

          <p className={para}>
            RAK Advisory does not intend to sell, misuse or disclose company
            information for unauthorized purposes. Information may be
            accessed or shared only where reasonably necessary for legitimate
            platform operations and permitted purposes, including:
          </p>

          <ul className={list}>
            <li>
              Authorized administrators and personnel responsible for
              company management, verification and operational activities.
            </li>
            <li>
              Authorized service providers or technical partners who assist
              in hosting, maintaining, securing or supporting the platform,
              subject to appropriate confidentiality and data protection
              obligations.
            </li>
            <li>
              Relevant regulatory bodies, government authorities or legal
              agencies where disclosure is required or permitted by
              applicable law.
            </li>
            <li>
              Other parties where the company or its authorized
              representative has provided appropriate consent or where
              disclosure is otherwise legally permitted.
            </li>
          </ul>

          <p className={para}>
            Any such access or disclosure should be limited to the
            information reasonably required for the relevant purpose.
            Third-party service providers may process information in
            accordance with their respective contractual obligations and
            applicable privacy requirements.
          </p>

          {/* ----------------- User Account Responsibility ----------------- */}

          <h2 className={sectionTitle}>
            7. User Account and Access Responsibilities
          </h2>

          <p className={paraTight}>
            Each user is responsible for maintaining the confidentiality
            and security of their account credentials and ensuring that
            the account is used only by authorized individuals.
          </p>

          <ul className={list}>
            <li>
              Do not share your login credentials, passwords or
              authentication details with unauthorized individuals.
            </li>
            <li>
              Do not access the platform using another person's account
              without appropriate authorization.
            </li>
            <li>
              Ensure that information is entered, updated or modified
              only by authorized personnel.
            </li>
            <li>
              Log out of your account when using shared or public devices.
            </li>
            <li>
              Immediately report suspected account compromise, unauthorized
              access or unusual account activity.
            </li>
            <li>
              Do not attempt to bypass security controls or interfere with
              the platform's normal functionality.
            </li>
          </ul>

          <p className={para}>
            Users may be held responsible for activities performed through
            their accounts, subject to applicable law and the circumstances
            of the incident.
          </p>

          {/* ----------------- Data Security ----------------- */}

          <h2 className={sectionTitle}>8. Data Security and Protection</h2>

          <p className={para}>
            We take reasonable technical, administrative and organizational
            measures to protect the information maintained through the RAK
            ERP Admin Panel against unauthorized access, accidental loss,
            alteration, misuse or disclosure.
            <br />
            Access to company information should be restricted to authorized
            users based on their assigned roles and responsibilities.
            Appropriate safeguards may include access controls,
            authentication mechanisms, secure data handling practices,
            system monitoring and other reasonable security measures.
            <br />
            While we make reasonable efforts to safeguard information, no
            electronic storage system or internet-based transmission method
            can be guaranteed to be completely secure. We therefore cannot
            guarantee absolute security against every possible technical
            threat, cyberattack or unauthorized incident.
          </p>

          {/* ----------------- Data Retention ----------------- */}

          <h2 className={sectionTitle}>
            9. Information Retention and Management
          </h2>

          <p className={para}>
            Company information and supporting documents may be retained
            for as long as reasonably necessary to maintain company
            records, facilitate administrative operations, fulfill
            legitimate business purposes and comply with applicable
            legal or regulatory requirements.
            <br />
            Users may request correction or updates to inaccurate company
            information through the appropriate administrative channels.
            Requests relating to access, modification or deletion of
            information will be considered subject to applicable legal,
            contractual and operational requirements.
            <br />
            Information may be retained even after an account is deactivated
            or access is discontinued where retention is necessary for
            legitimate record-keeping or legal compliance.
          </p>

          {/* ----------------- User Responsibilities ----------------- */}

          <h2 className={sectionTitle}>
            10. User Responsibilities and Prohibited Activities
          </h2>

          <p className={paraTight}>By using the platform, you agree that you will:</p>

          <ul className={list}>
            <li>
              Use the platform only for its intended company management
              and administrative purposes.
            </li>
            <li>
              Provide genuine information and authentic supporting
              documentation.
            </li>
            <li>
              Respect the confidentiality and ownership of company
              information.
            </li>
            <li>Follow applicable laws, regulations and platform policies.</li>
            <li>
              Avoid unauthorized access, data extraction, misuse or
              distribution of information.
            </li>
            <li>
              Refrain from uploading malicious files, harmful content or
              unauthorized documents.
            </li>
            <li>
              Cooperate with reasonable verification and administrative
              requests.
            </li>
          </ul>

          <p className={para}>
            Any activity involving fraudulent submissions, unauthorized
            disclosure, deliberate data manipulation or misuse of platform
            access may result in suspension or restriction of access and
            may be reported to the appropriate authorities where required
            by law.
          </p>

          {/* ----------------- Limitation of Responsibility ----------------- */}

          <h2 className={sectionTitle}>11. Limitation of Responsibility</h2>

          <p className={para}>
            Users acknowledge that the platform serves as a digital system
            for maintaining and managing company information and records.
            The accuracy, authenticity and completeness of information
            submitted by users remain the responsibility of the respective
            user or authorized company representative.
            <br />
            RAK Advisory shall take reasonable measures to maintain the
            platform and protect information. However, we do not warrant
            uninterrupted or error-free availability of the platform or
            absolute protection against events beyond reasonable control,
            including network failures, cyber incidents or third-party
            service interruptions.
            <br />
            Nothing in these terms shall exclude or limit any responsibility
            that cannot legally be excluded or limited under applicable law.
          </p>

          {/* ----------------- Policy Updates ----------------- */}

          <h2 className={sectionTitle}>12. Changes to These Terms & Conditions</h2>

          <p className={para}>
            RAK Advisory reserves the right to review, modify or update
            these Terms & Conditions from time to time to reflect changes
            in platform functionality, business requirements, security
            practices or applicable legal and regulatory requirements.
            <br />
            Updated terms will be made available through the platform.
            Users are encouraged to review the terms periodically to remain
            informed of their responsibilities and applicable conditions.
            Where necessary, users may be requested to provide fresh
            acceptance of updated terms before continuing to use the
            platform.
          </p>

          {/* ----------------- Applicable Law ----------------- */}

          <h2 className={sectionTitle}>13. Governing Law and Compliance</h2>

          <p className={para}>
            These Terms & Conditions shall be interpreted and governed
            in accordance with the applicable laws of India, subject
            to the nature of the services and the legal requirements
            applicable to the platform.
            <br />
            Users agree to comply with all applicable data protection,
            information technology, corporate, financial and other
            regulatory requirements relevant to their use of the
            platform and submission of company information.
            <br />
            Any dispute arising in connection with the use of the
            platform shall be addressed in accordance with applicable
            laws and the appropriate legal jurisdiction.
          </p>

          {/* ----------------- Acceptance and Consent ----------------- */}

          <h2 className={sectionTitle}>14. Declaration and Acceptance</h2>

          <p className={para}>
            By selecting the acceptance checkbox and proceeding to access
            the RAK ERP Admin Panel, you acknowledge and confirm that:
          </p>

          <ul className={list}>
            <li>You have read and understood these Terms & Conditions.</li>
            <li>
              You voluntarily consent to the collection, storage and
              authorized processing of company and user information
              submitted through the platform.
            </li>
            <li>
              You have the necessary authority to submit the company
              information and supporting documents.
            </li>
            <li>
              You understand that the information will be used for
              legitimate company management, verification, compliance
              and administrative purposes.
            </li>
            <li>
              You agree not to misuse, manipulate, disclose or
              unauthorizedly access company information.
            </li>
            <li>
              You accept responsibility for the accuracy of information
              submitted through your account and for complying with
              these Terms & Conditions.
            </li>
          </ul>

          <p className={para}>
            If you do not agree with these Terms & Conditions, you
            should not proceed with using the platform. Your acceptance
            will be treated as confirmation of your agreement to the
            conditions described above, subject to applicable law.
          </p>
        </div>

        {/* ----------------- Footer: checkbox + accept ----------------- */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          {/* ----------------- Acceptance Checkbox ----------------- */}
          <label className="mb-4 flex cursor-pointer items-start gap-3 text-[14px] text-slate-700">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-blue-800"
            />
            <span>
              I have read and agree to the{" "}
              <span className="font-medium text-blue-700 underline">
                Terms & Conditions
              </span>{" "}
              and consent to the authorized use of my company information.
            </span>
          </label>

          {/* ----------------- Accept Button ----------------- */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleAccept}
              disabled={!isChecked || loading}
              className={`min-w-[110px] rounded-lg px-5 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors ${
                isChecked && !loading
                  ? "cursor-pointer bg-blue-800 hover:bg-blue-900"
                  : "cursor-not-allowed bg-slate-300"
              }`}
            >
              {loading ? "Saving..." : "Accept"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;