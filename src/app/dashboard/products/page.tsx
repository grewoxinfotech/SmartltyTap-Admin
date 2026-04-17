 "use client";

import styles from "../dashboard.module.css";
import { Plus, Edit, Trash2, Package as PackageIcon } from "lucide-react";
import { useAdminDB } from "@/hooks/use-admin-db";

export default function ProductsCatalog() {
  const { db, update, createId } = useAdminDB();
  if (!db) return null;
  const products = db.products;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Products Catalog</h1>
        <button
          className="btn btn-primary"
          onClick={() =>
            update((prev) => ({
              ...prev,
              products: [
                {
                  id: createId("PROD"),
                  name: "New Product",
                  price: 29.99,
                  stock: 50,
                  imageUrl: "",
                  images: [],
                },
                ...prev.products,
              ],
            }))
          }
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Physical NFC Cards</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Images</th>
              <th>Price</th>
              <th>Stock Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "0.5rem",
                        objectFit: "cover",
                        border: "1px solid var(--color-border)",
                      }}
                    />
                  ) : (
                    <div style={{ padding: "0.5rem", background: "var(--color-bg-base)", borderRadius: "var(--radius-sm)" }}>
                      <PackageIcon size={16} color="var(--color-text-muted)" />
                    </div>
                  )}
                  {product.name}
                </td>
                <td style={{ fontWeight: 600 }}>{product.images?.length ?? (product.imageUrl ? 1 : 0)}</td>
                <td style={{ fontWeight: 600 }}>${product.price.toFixed(2)}</td>
                <td>{product.stock} units</td>
                <td>
                  <span className={`${styles.badge} ${product.stock > 0 ? styles.badgeSuccess : styles.badgeDanger}`}>
                    {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn"
                      style={{ padding: '0.25rem', color: 'var(--color-primary)' }}
                      onClick={() =>
                        update((prev) => ({
                          ...prev,
                          products: prev.products.map((entry) =>
                            entry.id === product.id ? { ...entry, price: Number((entry.price + 1).toFixed(2)) } : entry
                          ),
                        }))
                      }
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn"
                      style={{ padding: '0.25rem', color: 'var(--color-danger)' }}
                      onClick={() => update((prev) => ({ ...prev, products: prev.products.filter((entry) => entry.id !== product.id) }))}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
