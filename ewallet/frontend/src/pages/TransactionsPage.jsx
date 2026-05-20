import React from "react";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import { readAuth } from "../auth/session.js";
import { listUserTransactions } from "../api/transactionApi.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import TransactionList from "../components/ui/TransactionList.jsx";
import { Icon } from "../components/ui/Icons.jsx";
import "./appPages.css";

const PAGE_SIZE_OPTIONS = [8, 10, 20, 50];

export default function TransactionsPage() {
  const toast = useToast();
  const auth = readAuth();
  const userId = auth?.userId;
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({ content: [], totalPages: 0, totalElements: 0, number: 0 });

  const load = React.useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const result = await listUserTransactions(userId, { page, size: pageSize });
      setData(result || { content: [], totalPages: 0, totalElements: 0, number: page });
    } catch (e) {
      toast.push({
        type: "error",
        title: "Transactions failed",
        message: e?.message || "We could not load your transactions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, toast, userId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const totalPages = Number(data?.totalPages || 0);
  const currentPage = Number(data?.number ?? page);
  const canPrev = currentPage > 0 && !loading;
  const canNext = totalPages > 0 && currentPage < totalPages - 1 && !loading;

  return (
    <Shell cta={<AppCtas />} footer={false}>
      <div className="appPage">
        <div className="appTitleRow">
          <div>
            <div className="appTitle">Transactions</div>
            <div className="appSub">Every wallet movement, sorted by the latest activity.</div>
          </div>
          <button className="btn btn--ghost" type="button" onClick={load} disabled={loading}>
            <Icon name="refresh" />
            Refresh
          </button>
        </div>

        <div className="transactionSummaryBand">
          <div>
            <span>Total transactions</span>
            <strong>{Number(data?.totalElements || 0)}</strong>
          </div>
          <div>
            <span>Page</span>
            <strong>{totalPages ? `${currentPage + 1} of ${totalPages}` : "0 of 0"}</strong>
          </div>
          <div>
            <span>User ID</span>
            <strong>{String(userId || "-")}</strong>
          </div>
        </div>

        <div className="transactionToolbar">
          <label className="field transactionToolbar__field">
            <span className="label">Transactions per page</span>
            <select
              className="input"
              value={pageSize}
              onChange={(e) => {
                setPage(0);
                setPageSize(Number(e.target.value));
              }}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <section className={pageSize > 10 ? "transactionScrollSection" : undefined}>
          <TransactionList
            transactions={data?.content || []}
            userId={userId}
            loading={loading}
            emptyText="No wallet transactions are available yet."
          />
        </section>

        <div className="paginationBar">
          <button className="btn btn--ghost" type="button" disabled={!canPrev} onClick={() => setPage((p) => Math.max(p - 1, 0))}>
            <Icon name="chevron-left" />
            Previous
          </button>
          <div className="paginationBar__count">{totalPages ? `Page ${currentPage + 1}` : "No pages"}</div>
          <button className="btn btn--ghost" type="button" disabled={!canNext} onClick={() => setPage((p) => p + 1)}>
            Next
            <Icon name="chevron-right" />
          </button>
        </div>
      </div>
    </Shell>
  );
}
