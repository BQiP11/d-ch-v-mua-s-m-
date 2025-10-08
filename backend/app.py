import hashlib
import json
import secrets
import sqlite3
from contextlib import contextmanager
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

DATABASE_PATH = "backend/novawave.db"
ADMIN_ENROLL_KEY = "NEBULA"
DEFAULT_SETTINGS = {
    "features": {
        "hologramCards": True,
        "waveMotion": True,
        "glowHighlights": True,
        "autoRecommendations": True,
    },
    "payment": {
        "status": "online",
        "announcement": "Thanh toán PayPal giảm 10% hôm nay!",
    },
}


def _dict_factory(cursor, row):
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}


@contextmanager
def get_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = _dict_factory
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price INTEGER NOT NULL,
                description TEXT NOT NULL,
                image_url TEXT NOT NULL,
                popularity INTEGER NOT NULL DEFAULT 50,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                total INTEGER NOT NULL,
                payment_method TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price INTEGER NOT NULL,
                FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY(product_id) REFERENCES products(id)
            );

            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            """
        )

        admin_exists = conn.execute(
            "SELECT 1 FROM users WHERE role='admin' LIMIT 1"
        ).fetchone()
        if not admin_exists:
            create_user(
                conn,
                name="Nova Admin",
                email="admin@novawave.vn",
                password="admin123",
                role="admin",
            )

        product_count = conn.execute("SELECT COUNT(*) AS count FROM products").fetchone()[
            "count"
        ]
        if product_count == 0:
            seed_products(conn)

        settings_rows = conn.execute(
            "SELECT key FROM settings"
        ).fetchall()
        existing_keys = {row["key"] for row in settings_rows}
        for key, value in DEFAULT_SETTINGS.items():
            if key not in existing_keys:
                conn.execute(
                    "INSERT INTO settings (key, value) VALUES (?, ?)",
                    (key, json.dumps(value)),
                )


def seed_products(conn: sqlite3.Connection):
    now = datetime.utcnow().isoformat()
    catalog = [
        (
            "AeroPulse Tai nghe AR",
            "Công nghệ",
            2599000,
            "Tai nghe không dây phủ AR, cách âm chủ động và tương tác cảm biến chuyển động.",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
            98,
        ),
        (
            "LunaFibre Áo khoác phản quang",
            "Thời trang",
            1899000,
            "Chất liệu nano giữ nhiệt, đổi màu theo ánh sáng và hiển thị thông báo thông minh.",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
            88,
        ),
        (
            "NebulaBoard Bàn phím hologram",
            "Thiết bị",
            3299000,
            "Bàn phím cảm ứng không khung với hiệu ứng hologram và phản hồi haptic",
            "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?auto=format&fit=crop&w=800&q=80",
            95,
        ),
        (
            "FluxStep Giày tự điều chỉnh",
            "Thời trang",
            1499000,
            "Giày sneaker với đệm khí thông minh và cảm biến phân tích bước chân realtime.",
            "https://images.unsplash.com/photo-1542293787938-4d2226df1672?auto=format&fit=crop&w=800&q=80",
            82,
        ),
        (
            "HelioBrew Máy pha cà phê AI",
            "Gia dụng",
            2799000,
            "Pha chế theo khẩu vị cá nhân bằng phân tích hương vị và nhiệt độ chính xác.",
            "https://images.unsplash.com/photo-1507914372361-74f3f90d4d1a?auto=format&fit=crop&w=800&q=80",
            91,
        ),
    ]
    conn.executemany(
        """
        INSERT INTO products (name, category, price, description, image_url, popularity, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        [(name, category, price, desc, image, pop, now) for name, category, price, desc, image, pop in catalog],
    )


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.sha256(f"{salt}:{password}".encode()).hexdigest()
    return f"{salt}${digest}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt, digest = stored.split("$")
    except ValueError:
        return False
    candidate = hashlib.sha256(f"{salt}:{password}".encode()).hexdigest()
    return secrets.compare_digest(candidate, digest)


def create_user(
    conn: sqlite3.Connection,
    *,
    name: str,
    email: str,
    password: str,
    role: str = "user",
):
    now = datetime.utcnow().isoformat()
    conn.execute(
        """
        INSERT INTO users (name, email, password_hash, role, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (name, email.lower(), hash_password(password), role, now),
    )


def create_session(conn: sqlite3.Connection, user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    now = datetime.utcnow().isoformat()
    conn.execute(
        "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
        (token, user_id, now),
    )
    return token


def load_settings(conn: sqlite3.Connection) -> Dict[str, dict]:
    rows = conn.execute("SELECT key, value FROM settings").fetchall()
    return {row["key"]: json.loads(row["value"]) for row in rows}


def save_setting(conn: sqlite3.Connection, key: str, value: dict):
    conn.execute(
        "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        (key, json.dumps(value)),
    )


class ProductPayload(BaseModel):
    name: str
    category: str
    price: int = Field(gt=0)
    description: str
    image_url: str
    popularity: int = Field(ge=0, le=100, default=50)


class RegisterPayload(BaseModel):
    name: str
    email: EmailStr
    password: str
    admin_key: Optional[str] = None


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class OrderItemPayload(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderPayload(BaseModel):
    items: List[OrderItemPayload]
    payment_method: str


class FeatureTogglePayload(BaseModel):
    toggles: Dict[str, bool]


class PaymentConfigPayload(BaseModel):
    status: str
    announcement: str


app = FastAPI(title="NovaWave API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"]
    ,
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()


async def get_current_session(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Thiếu token")
    token = authorization.split()[1]
    with get_connection() as conn:
        record = conn.execute(
            """
            SELECT sessions.token, users.id, users.name, users.email, users.role
            FROM sessions
            JOIN users ON users.id = sessions.user_id
            WHERE sessions.token = ?
            """,
            (token,),
        ).fetchone()
    if not record:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token không hợp lệ")
    return record


async def get_current_user(session=Depends(get_current_session)):
    return session


async def get_admin_user(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Yêu cầu quyền admin")
    return user


@app.post("/api/auth/register")
def register(payload: RegisterPayload):
    with get_connection() as conn:
        existing = conn.execute(
            "SELECT id FROM users WHERE email = ?",
            (payload.email.lower(),),
        ).fetchone()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email đã tồn tại")

        role = "admin" if payload.admin_key == ADMIN_ENROLL_KEY else "user"
        if payload.admin_key and role != "admin":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mã admin không chính xác")

        create_user(
            conn,
            name=payload.name,
            email=payload.email,
            password=payload.password,
            role=role,
        )
        user_row = conn.execute(
            "SELECT id, name, email, role FROM users WHERE email = ?",
            (payload.email.lower(),),
        ).fetchone()
        token = create_session(conn, user_row["id"])
        return {"token": token, "user": user_row}


@app.post("/api/auth/login")
def login(payload: LoginPayload):
    with get_connection() as conn:
        user = conn.execute(
            "SELECT id, name, email, role, password_hash FROM users WHERE email = ?",
            (payload.email.lower(),),
        ).fetchone()
        if not user or not verify_password(payload.password, user["password_hash"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Thông tin đăng nhập sai")
        token = create_session(conn, user["id"])
        user.pop("password_hash", None)
        return {"token": token, "user": user}


@app.get("/api/auth/me")
def auth_me(user=Depends(get_current_user)):
    return {"user": user}


@app.post("/api/auth/logout")
def logout(user=Depends(get_current_session)):
    token = user["token"]
    with get_connection() as conn:
        conn.execute("DELETE FROM sessions WHERE token = ?", (token,))
    return {"success": True}


@app.get("/api/products")
def list_products():
    with get_connection() as conn:
        products = conn.execute(
            "SELECT id, name, category, price, description, image_url, popularity, created_at FROM products ORDER BY created_at DESC"
        ).fetchall()
    return {"products": products}


@app.post("/api/products", status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductPayload, admin=Depends(get_admin_user)):
    now = datetime.utcnow().isoformat()
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO products (name, category, price, description, image_url, popularity, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.name,
                payload.category,
                payload.price,
                payload.description,
                payload.image_url,
                payload.popularity,
                now,
            ),
        )
        product_id = cursor.lastrowid
        product = conn.execute(
            "SELECT id, name, category, price, description, image_url, popularity, created_at FROM products WHERE id = ?",
            (product_id,),
        ).fetchone()
    return product


@app.put("/api/products/{product_id}")
def update_product(product_id: int, payload: ProductPayload, admin=Depends(get_admin_user)):
    with get_connection() as conn:
        existing = conn.execute(
            "SELECT id FROM products WHERE id = ?",
            (product_id,),
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy sản phẩm")
        conn.execute(
            """
            UPDATE products
            SET name = ?, category = ?, price = ?, description = ?, image_url = ?, popularity = ?
            WHERE id = ?
            """,
            (
                payload.name,
                payload.category,
                payload.price,
                payload.description,
                payload.image_url,
                payload.popularity,
                product_id,
            ),
        )
        product = conn.execute(
            "SELECT id, name, category, price, description, image_url, popularity, created_at FROM products WHERE id = ?",
            (product_id,),
        ).fetchone()
    return product


@app.delete("/api/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, admin=Depends(get_admin_user)):
    with get_connection() as conn:
        conn.execute("DELETE FROM products WHERE id = ?", (product_id,))
    return None


@app.get("/api/categories")
def list_categories():
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT category, COUNT(*) AS total FROM products GROUP BY category ORDER BY category"
        ).fetchall()
    return {"categories": rows}


@app.get("/api/settings")
def get_settings():
    with get_connection() as conn:
        settings = load_settings(conn)
    return settings


@app.put("/api/settings/features")
def update_features(payload: FeatureTogglePayload, admin=Depends(get_admin_user)):
    with get_connection() as conn:
        save_setting(conn, "features", payload.toggles)
        features = load_settings(conn)["features"]
    return {"features": features}


@app.put("/api/settings/payment")
def update_payment(payload: PaymentConfigPayload, admin=Depends(get_admin_user)):
    with get_connection() as conn:
        save_setting(conn, "payment", payload.dict())
        payment = load_settings(conn)["payment"]
    return {"payment": payment}


@app.get("/api/orders")
def list_orders(user=Depends(get_current_user)):
    with get_connection() as conn:
        if user["role"] == "admin":
            orders = conn.execute(
                "SELECT o.id, o.total, o.payment_method, o.status, o.created_at, u.name AS customer_name FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC"
            ).fetchall()
        else:
            orders = conn.execute(
                "SELECT id, total, payment_method, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC",
                (user["id"],),
            ).fetchall()
        order_ids = [o["id"] for o in orders]
        items_map = {}
        if order_ids:
            placeholders = ",".join(["?"] * len(order_ids))
            rows = conn.execute(
                f"SELECT oi.order_id, oi.quantity, oi.price, p.name FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id IN ({placeholders})",
                order_ids,
            ).fetchall()
            for row in rows:
                items_map.setdefault(row["order_id"], []).append(row)
    for order in orders:
        order["items"] = items_map.get(order["id"], [])
    return {"orders": orders}


@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderPayload, user=Depends(get_current_user)):
    if not payload.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Giỏ hàng trống")
    with get_connection() as conn:
        product_ids = [item.product_id for item in payload.items]
        placeholders = ",".join(["?"] * len(product_ids))
        db_products = conn.execute(
            f"SELECT id, price FROM products WHERE id IN ({placeholders})",
            product_ids,
        ).fetchall()
        price_map = {prod["id"]: prod["price"] for prod in db_products}
        missing = [pid for pid in product_ids if pid not in price_map]
        if missing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Sản phẩm không hợp lệ: {missing}")
        total = sum(price_map[item.product_id] * item.quantity for item in payload.items)
        now = datetime.utcnow().isoformat()
        cursor = conn.execute(
            """
            INSERT INTO orders (user_id, total, payment_method, status, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                total,
                payload.payment_method,
                "processing",
                now,
            ),
        )
        order_id = cursor.lastrowid
        conn.executemany(
            """
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
            """,
            [
                (
                    order_id,
                    item.product_id,
                    item.quantity,
                    price_map[item.product_id],
                )
                for item in payload.items
            ],
        )
        order = conn.execute(
            "SELECT id, total, payment_method, status, created_at FROM orders WHERE id = ?",
            (order_id,),
        ).fetchone()
        items = conn.execute(
            """
            SELECT oi.quantity, oi.price, p.name
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = ?
            """,
            (order_id,),
        ).fetchall()
        order["items"] = items
    return order


@app.get("/api/dashboard/metrics")
def dashboard_metrics(user=Depends(get_admin_user)):
    with get_connection() as conn:
        total_users = conn.execute("SELECT COUNT(*) AS total FROM users").fetchone()["total"]
        total_products = conn.execute("SELECT COUNT(*) AS total FROM products").fetchone()["total"]
        total_orders_row = conn.execute(
            "SELECT COUNT(*) AS total, COALESCE(SUM(total), 0) AS revenue FROM orders"
        ).fetchone()
        last_orders = conn.execute(
            "SELECT id, total, payment_method, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5"
        ).fetchall()
    return {
        "users": total_users,
        "products": total_products,
        "orders": total_orders_row["total"],
        "revenue": total_orders_row["revenue"],
        "recentOrders": last_orders,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
