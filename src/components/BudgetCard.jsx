import { currencyFormatter ,dateFormatter } from '@/utils/functions/utils';
import React,{useState} from 'react'
import DeleteBudgetModal from './DeleteBudgetModal';
import EditBudgetModal from './EditBudgetModal';

const BudgetCard = ({budget}) => {

    const [selectedBudget, setSelectedBudget] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
    const openEditModal = (budget) => {
      setSelectedBudget(budget);
      setEditModalOpen(true);
    };
  
    const openDeleteModal = (budget) => {
      setSelectedBudget(budget);
      setDeleteModalOpen(true);
    };
  

    const closeModals = () => {
        setEditModalOpen(false);
        setDeleteModalOpen(false);
      };
   
  return (
    <div>
         <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-500">Budget Name</h2>
              <h2 className="text-lg font-bold text-gray-800">{budget.categoryname}</h2>
            </div>
            <div className="space-x-2">
              <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500"
              onClick={()=> openEditModal(budget)}>
                Edit
              </button>
              <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500"
              onClick={()=> openDeleteModal(budget)}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-lg font-bold text-gray-500">Budget Amount</p>
            <p className="text-lg font-semibold text-gray-800">{currencyFormatter(budget.budgetamount)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-lg font-bold text-gray-500">Month</p>
            <p className="text-lg font-semibold text-gray-800">{dateFormatter(budget.monthyear)}</p>
          </div>

          {/* <p className="text-lg font-semibold text-gray-500">Already spent</p>
          <div className="mt-2 bg-gray-200 h-4 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-1/2">hh</div>
          </div> */}
        </div>

        {deleteModalOpen && <DeleteBudgetModal budget={selectedBudget} onClose={closeModals} />}
        {editModalOpen  && <EditBudgetModal updatedBudget={selectedBudget} onClose={closeModals} />}
    </div>
  )
}

export default BudgetCard