import React, { useEffect, useState } from "react";
import { Table, Button, Spin, message } from "antd";
import instance from "../../api/axios";

interface DebtorType {
  id: string;
  name: string;
  phone_number?: string;
  amount: number;
}

const Debtors: React.FC = () => {
  const [debtors, setDebtors] = useState<DebtorType[]>([]);
  const [loading, setLoading] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);

  const fetchDebtors = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/payments/debtors");
      setDebtors(res.data || []);
    } catch {
      message.error("Qarzdorlarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const notifyDebtors = async () => {
    setNotifyLoading(true);
    try {
      await instance.post("/payments/debtors/notify");
      message.success("Qarzdorlarga xabar yuborildi!");
    } catch {
      message.error("Xabar yuborishda xatolik");
    } finally {
      setNotifyLoading(false);
    }
  };

  useEffect(() => { fetchDebtors(); }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Qarzdorlar</h2>
        <Button type="primary" onClick={notifyDebtors} loading={notifyLoading} disabled={debtors.length === 0}>
          Qarzdorlarga xabar yuborish
        </Button>
      </div>
      <Spin spinning={loading}>
        <Table
          dataSource={debtors}
          columns={[
            { title: "Ism", dataIndex: "name", key: "name" },
            { title: "Telefon", dataIndex: "phone_number", key: "phone_number" },
            { title: "Qarzdorlik", dataIndex: "amount", key: "amount" }
          ]}
          rowKey={r => r.id}
          pagination={false}
        />
      </Spin>
    </div>
  );
};

export default Debtors;
