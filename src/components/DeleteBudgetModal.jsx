import DataService from "@/lib/fetch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteBudgetModal = ({ budget, onClose }) => {
    const router = useRouter()

  const handleDelete = async(budget) => {
    try {
       const response =  await DataService.deleteDataNoAuth(`/budget/api?id=${budget.id}&user=${budget.userId}`)
      toast.success(response);
      onClose()
     router.refresh()
    } catch (error) {
      toast.error(error);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-lg font-semibold mb-4">Delete Budget</h2>
        <p className="text-sm text-gray-700 mb-4">Are you sure you want to delete the budget {budget.name} ?</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 text-sm rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancel
          </button>
          <button onClick={() => handleDelete(budget)} className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBudgetModal;
