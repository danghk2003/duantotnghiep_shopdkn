import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { formatCurrencyVnd, formatNumber } from '../../../utils/formatCurrency';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// antd
import { Col, Tag, Select, Row, Button, Space, Input, DatePicker  } from "antd"
import moment from 'moment';
// routes
import { DUONG_DAN_TRANG } from "../../../routes/duong-dan"
// components
import FormProvider from '../../../components/hook-form/FormProvider';
import RHFInput from '../../../components/hook-form/RHFInput';
// hooks
import useConfirm from '../../../hooks/useConfirm';
import useNotification from '../../../hooks/useNotification';
import useLoading from '../../../hooks/useLoading';

const { Option } = Select;

const DANH_SACH_TRANG_THAI_THUONG_HIEU = ['Đang hoạt động', 'Ngừng hoạt động'];

// ----------------------------------------------------------------------

export default function FormThemSuaThuongHieu({ laCapNhat, thuongHieuHienTai }) {
  const { onOpenSuccessNotify } = useNotification(); //mở thông báo
  const { showConfirm } = useConfirm(); // mở confirm
  const { onOpenLoading, onCloseLoading } = useLoading(); //mở, tắt loading

  const navigate = useNavigate();

//   useEffect(() => {
//     // khai báo hàm lấy dữ liệu thuộc tính khách hàng
//     const layDuLieuThuocTinhTuBackEnd = async () => {
//       // bật loading
//       onOpenLoading();
//       try {
//         // gọi api từ backend
//         const response = await axios.get("http://127.0.0.1:8000/api/danh-sach-thuoc-tinh");

//         // nếu gọi api thành công sẽ set dữ liệu
//         setListMauSac(response.data.data.listMauSac); // set dữ liệu được trả về từ backend
//         setListThuongHieu(response.data.data.listThuongHieu); // set dữ liệu được trả về từ backend
//       } catch (error) {
//         console.error(error);
//         // console ra lỗi
//       } finally {
//         onCloseLoading();
//         // tắt loading
//       }
//     }

//     layDuLieuThuocTinhTuBackEnd();
//   }, [])

  // validate
  const ThuongHieuSchema = Yup.object().shape({
//     tenSanPham: Yup.string().trim().required('Tên không được bỏ trống'),
//     maSanPham: Yup.string().trim().required('Mã không được bỏ trống'),
//     donGia: Yup.string().required('Đơn giá không được bỏ trống'),
//     idMauSac: Yup.string().required('Màu không được bỏ trống'),
//     idThuongHieu: Yup.string().required('Thương hiệu không được bỏ trống'),
  });

  // giá trị mặc định của biến, tương tự useState
  const defaultValues = {
    tenThuongHieu: thuongHieuHienTai?.tenThuongHieu || '',
    trangThai: chuyenDoiEnumThanhTrangThai(thuongHieuHienTai?.trangThai),
  };

  // lấy methods từ use form
  const methods = useForm({
    resolver: yupResolver(ThuongHieuSchema),
    defaultValues,
  });

  // các phương thức của methods
  const {
    reset,
    control,
    handleSubmit,
  } = methods;

  useEffect(() => {
    // nếu là trang cập nhật => sẽ reset lại các biến trong defaultValues
    if (laCapNhat && thuongHieuHienTai) {
      reset(defaultValues);
    }
    // nếu là trang thêm mới => sẽ reset lại các biến trong defaultValues
    if (!laCapNhat) {
      reset(defaultValues);
    }
  }, [laCapNhat, thuongHieuHienTai]) // gọi useEffect này mỗi khi các tham số truyền vào thay đỏi

  // hàm gọi api thêm mới khách hàng
  const post = async (body) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/thuong-hieu", body); // gọi api
      navigate(DUONG_DAN_TRANG.san_pham.cap_nhat_thuong_hieu(response.data.data.id)); // chuyển sang trang cập nhật
      onOpenSuccessNotify('Thêm mới thương hiệu thành công!') // hiển thị thông báo 
    } catch (error) {
      console.log(error);
    }
  }

  const put = async (body, id) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/thuong-hieu/${id}`, body); // gọi API cập nhật
      navigate(DUONG_DAN_TRANG.san_pham.cap_nhat_thuong_hieu(response.data.data.id)); // chuyển sang trang cập nhật
      onOpenSuccessNotify('Cập nhật thương hiệu thành công!'); // hiển thị thông báo 
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async (data) => {
    if (!laCapNhat) {
        const body = {
        ...data, // giữ các biến cũ trong data 
        trangThai: chuyenDoiThanhEnum(data.trangThai), // ghi đè thuộc tính trạng thái trong data, convert thành enum
        }
        console.log(body);
        // hiển thị confirm
        showConfirm("Xác nhận thêm mới thương hiệu?", "Bạn có chắc chắn muốn thêm thương hiệu?", () => post(body));
    }else{
        const body = {
            ...data, // giữ các biến cũ trong data 
            trangThai: chuyenDoiThanhEnum(data.trangThai), // ghi đè thuộc tính trạng thái trong data, convert thành enum
            }
            console.log(body);
            // hiển thị confirm
            showConfirm("Xác nhận cập nhật thương hiệu?", "Bạn có chắc chắn muốn cập nhật thương hiệu?", () => put(body,  thuongHieuHienTai?.id));
    }
  }

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Row className='mt-10' gutter={25} style={{ display: "flex", justifyContent: "center" }}>

          <Col span={9}>
            <RHFInput
              label='Tên thương hiệu'
              name='tenThuongHieu'
              placeholder='Nhập tên thương hiệu'
              required
            />
          </Col>

          <Col span={9}>
            <Controller
              name='trangThai'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <label className='mt-15 d-block' style={{ fontWeight: '500' }}>
                    Trạng thái
                    <span className='required'></span>
                  </label>
                  <Select
                    style={{ width: '100%' }}
                    className='mt-13'
                    {...field}
                    placeholder='Chọn trạng thái'
                  >
                    {DANH_SACH_TRANG_THAI_THUONG_HIEU.map((trangThai, index) => {
                      return (
                        <>
                          <Option key={index} value={trangThai}>{trangThai}</Option>
                        </>
                      )
                    })}
                  </Select>
                  {error && <span className='color-red mt-3 d-block'>{error?.message}</span>}
                </>
              )}
            />
          </Col>


          <Col span={18} style={{ display: 'flex', justifyContent: 'end' }} className="mt-10">
            <Space className='mt-20 mb-5'>
              <Button onClick={() => navigate(DUONG_DAN_TRANG.khach_hang.danh_sach)}>Hủy bỏ</Button>
              <Button
                htmlType='submit'
                type='primary'
                >
                {laCapNhat ? 'Cập nhật' : 'Lưu'}
                </Button>
            </Space>
          </Col>

        </Row>

      </FormProvider>
    </>
  )
}


const chuyenDoiThanhEnum = (trangThai) => {
  switch (trangThai) {
    case "Đang hoạt động":
      return "dang_hoat_dong";
    case "Ngừng hoạt động":
      return "ngung_hoat_dong";
    default:
      return null;
  }
};

const chuyenDoiEnumThanhTrangThai = (trangThai) => {
  switch (trangThai) {
    case "dang_hoat_dong":
      return "Đang hoạt động";
    case "ngung_hoat_dong":
      return "Ngừng hoạt động";
    default:
      return "Đang hoạt động";
  }
};

