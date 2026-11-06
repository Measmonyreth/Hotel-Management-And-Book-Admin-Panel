import CustomerDetailRow from "./customerdetailrow";


interface CustomerDetailCardProps {
  customer: {
    icon: React.ComponentType<{ size: number }>;
    color: string;
    label: string;
    value: string;
  }[];
}
export default function CustomerDetailCard({ customer }: CustomerDetailCardProps) {
  return (
    <div className=" rounded-2xl border border-slate-200 bg-white shadow-sm">
       <div className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100/50 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Customer Information</h2>
          </div >
           <div className="divide-y divide-slate-200 ">
             {customer.map((detail, index) => {
               const IconComponent = detail.icon;
               return (
                 <CustomerDetailRow
                   key={index}
                   icon={IconComponent}
                   color={detail.color}
                   label={detail.label}
                   value={detail.value}
                 />
               );
             })}
          </div>
    </div>
  );
}