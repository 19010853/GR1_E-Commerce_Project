import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { admin_order_status_update, get_admin_order, messageClear } from '../../store/Reducers/orderReducer';
import toast from 'react-hot-toast';

const OrderDetails = () => {

    const { orderID } = useParams() 
    const dispatch = useDispatch() 
    const [status, setStatus] = useState('')
    const { order, errorMessage, successMessage } = useSelector(state => state.order)

    useEffect(() => {
        if (orderID) {
            dispatch(get_admin_order(orderID))
        }
    },[orderID])

    useEffect(() => {
      setStatus(order?.delivery_status)
    },[order])

    const status_update = (e) => {
        if (orderID) {
            dispatch(admin_order_status_update({orderId: orderID, info: {status: e.target.value} }))
            setStatus(e.target.value)
        }
    }

    useEffect(() => {
      if(errorMessage) {
        toast.error(errorMessage)
        dispatch(messageClear())
      }
      if(successMessage) {
        toast.success(successMessage)
        dispatch(messageClear())
      }
    },[errorMessage, successMessage])

    return (
        <div className='px-2 lg:px-7 pt-5'>
        <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center p-4 gap-2'>
                <h2 className='text-xl text-[#d0d2d6]'>Chi tiết đơn hàng</h2>
                <select onChange={status_update} value={status} name="" id="" className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#475569] border border-slate-700 rounded-md text-[#d0d2d6] w-full md:w-auto'>
                <option value="pending">đang chờ xử lý</option>
                <option value="processing">đang xử lý</option>
                <option value="warehouse">đang ở kho</option>
                <option value="placed">đã đặt hàng</option>
                <option value="cancelled">đã hủy</option>
                </select> 
            </div>

        <div className='p-4'>
            <div className='flex flex-col md:flex-row gap-4 text-lg text-[#d0d2d6]'>
                <div className='w-full md:w-1/3'>
                    <div className='pr-0 md:pr-3 text-[#d0d2d6] text-lg'>
                        <div className='flex flex-col gap-1'>
                            <h2 className='pb-2 font-semibold'>Giao đến: {order.shippingInfo?.name}</h2>
                            <p><span className='text-sm'>
                                {order.shippingInfo?.address} {order.shippingInfo?.province} {order.shippingInfo?.city} {order.shippingInfo?.area}</span></p> 
                        </div>
            <div className='flex justify-start items-center gap-3 mt-2'>
                <h2>Trạng thái thanh toán: </h2>
                <span className='text-base'>{order.payment_status}</span>
             </div>  
             <span>Giá: ${order.price}</span> 

            <div className='mt-4 flex flex-col gap-4 bg-[#8288ed] rounded-md'>
                <div className='text-[#d0d2d6]'>
    {
        order.products && order.products.map((p, i) =>  <div key={p._id} className='flex flex-col sm:flex-row gap-3 text-md items-start sm:items-center'>
        <img 
            className='w-[50px] h-[50px] object-cover' 
            src={p.images && p.images[0] ? p.images[0] : null} 
            alt={p.name || 'Hình ảnh sản phẩm'} 
        />

        <div>
            <h2>{p.name} </h2>
            <p>
                <span>Thương hiệu: {p.brand}</span>
            </p>
            <p>
                <span>Số lượng: {p.quantity}</span>
            </p>
        </div> 
    </div> )
    }    
                    
                   
                </div>
                </div>  

 

                    </div>
                </div> 

    <div className='w-full md:w-2/3'>
        <div className='pl-0 md:pl-3'>
            <div className='mt-4 flex flex-col bg-[#8288ed] rounded-md p-4'>
               

            {
                order?.suborder?.map((o,i) => <div key={o._id} className='text-[#d0d2d6] mt-2'>
                <div className='flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3'>
                    <h2>Người bán {i + 1} Đơn hàng: </h2>
                    <span>{o.delivery_status}</span> 
                </div>

                {
                    o.products?.map((p,i) =>  <div key={p._id} className='flex flex-col sm:flex-row gap-3 text-md mt-2 items-start sm:items-center'>
                    <img 
                        className='w-[50px] h-[50px] object-cover' 
                        src={p.images && p.images[0] ? p.images[0] : null} 
                        alt={p.name || 'Hình ảnh sản phẩm'} 
                    />

                    <div>
                        <h2>{p.name} </h2>
                        <p>
                            <span>Thương hiệu: {p.brand}</span>
                        </p>
                        <p>
                            <span>Số lượng: {p.quantity}</span>
                        </p>
                    </div> 
                </div> )
                }
               

            </div>)
            }   

 

            </div>

        </div>
        </div>            





            </div>


        </div>   
        </div> 
        </div>
    );
};

export default OrderDetails;