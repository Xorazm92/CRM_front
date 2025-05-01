import React, { useEffect, useState } from "react";
import { Table, Button, Spin, message } from "antd";
import instance from "../../api/axios";

interface DebtorType {
  id: string;
  name: string;
  phone_number?: string;
  group: string;
  amount: number;
}

const Debtors: React.FC = () => {
  const [debtors, setDebtors] = useState<DebtorType[]>([]);
  const [loading, setLoading] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const fetchDebtors = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/payments/debtors");
      // Mapping: har bir ustun bo'sh bo'lsa, '-' yoki 0 ko'rsatilsin
      const mapped = (res.data || []).map((item: any) => ({
        id: item.id,
        name: item.name || '-',
        phone_number: item.phone_number || '-',
        group: item.group || '-',
        amount: item.amount ?? 0
      }));
      setDebtors(mapped);
    } catch {
      message.error("Qarzdorlarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const notifyDebtors = async () => {
    if (!selectedRowKey) return;
    setNotifyLoading(true);
    try {
      await instance.post("/payments/debtors/notify", {
        debtorIds: [selectedRowKey],
      });
      message.success("Tanlangan qarzdorga xabar yuborildi!");
      setSelectedRowKey(null);
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
        <Button type="primary" onClick={notifyDebtors} loading={notifyLoading} disabled={!selectedRowKey}>
          Belgilanganlarga xabar yuborish
        </Button>
      </div>
      <Spin spinning={loading}>
        {debtors.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>Qarzdorlar yo'q</div>
        ) : (
          <Table
            dataSource={debtors}
            columns={[
              { title: "Ism", dataIndex: "name", key: "name" },
              { title: "Telefon", dataIndex: "phone_number", key: "phone_number" },
              { title: "Guruh", dataIndex: "group", key: "group" },
              { title: "Qarzdorlik", dataIndex: "amount", key: "amount" }
            ]}
            rowKey={r => r.id + '-' + r.group}
            pagination={false}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
              onChange: (keys) => setSelectedRowKey(keys[0] ?? null),
            }}
          />
        )}
      
      </Spin>
    </div>
  );
};

export default Debtors;
