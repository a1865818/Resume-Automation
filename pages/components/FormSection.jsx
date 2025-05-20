// components/FormSection.js

const FormSection = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default FormSection;
