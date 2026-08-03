import { FormEvent, useEffect, useMemo, useState } from 'react'
import './style.css'
import './catalog.css'
import './layout.css'
import './auth-layout.css'
import './features/auth/auth.css'
import './product-form.css'
import { useAuth } from './features/auth/AuthProvider'
import {
  CatalogInput,
  Company,
  Filter,
  Product,
  Transaction,
  STOCKProduct
} from './features/shared/domain'
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { LedgerPage } from './features/ledger/LedgerPage'  //거래내역
import { InventoryPage } from './features/inventory/InventoryPage' //재고
import { SettlementPage } from './features/settlement/SettlementPage' //정산
import { CatalogPage } from './features/catalog/CatalogPage' // 추가 삭제
import { useParams } from "react-router-dom";
type Tab = 'ledger' | 'inventory' | 'settlement' | 'product' | 'company'

export default function App() {
  const [tab, setTab] = useState<Tab>('ledger')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [stockproducts, setstockProducts] = useState<STOCKProduct[]>([])
  const [filter, setFilter] = useState<Filter>({
    keyword: '',
    flow: 'all',
    field: 'all',
    startDate: '',
    endDate: '',
  })

  const [loginOpen, setLoginOpen] = useState<false | 'login' | 'signup'>(false)
  const { user, logout } = useAuth()


  const fetchProduct = async () => {
    const response = await fetch(import.meta.env.VITE_DIRECT_URI + "/view/product", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const respData = await response.json();

    setProducts(respData);

  }

  const fetchCompany = async () => {
    const response = await fetch(import.meta.env.VITE_DIRECT_URI + "/view/company", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const respData = await response.json();

    setCompanies(respData);

  }

  const fetchTransaction = async () => {
    const response = await fetch(import.meta.env.VITE_DIRECT_URI + "/view/transaction", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const respData = await response.json();

    setTransactions(respData);

  }


  useEffect(
    () => { fetchTransaction(); },
    [transactions]
  )
  useEffect(
    () => {
      fetchCompany();
    },
    [companies, user]
  )
  useEffect(() => {
    setstockProducts(
      products.map((item) => ({
        name: item.name,
        stock: item.stock
      }))
    );
  }, [transactions]);
  useEffect(
    () => {
      fetchProduct();
    },
    [products, user]
  )
  const addCatalog = (kind: 'company' | 'product') => async (input: CatalogInput) => {


    if (kind === 'company') {
      const response = await fetch(import.meta.env.VITE_DIRECT_URI + "/insert/company", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyNumber: input.companyNumber || '',
          name: input.name,

        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const respData = await response.json();

      if (respData.status === "NLI") {
        alert("로그인이 되지 않았어요");
        return;
      } else if (respData.status === "NAI") {
        alert("운영자계정이 아니에요")
        return;
      } else if (respData.status === "NCI") {
        alert("회사정보가 없어요");
        return;
      } else if (respData.status === "NSI") {
        alert("회사정보가 저장에 오류가 있어요");
        return;
      }

      setCompanies((items) =>
        items.some((item) => item.companyNumber === input.companyNumber)
          ? items
          : [
            {
              id: respData.id,
              companyNumber: respData.companyNumber,
              name: respData.companyName,
              createdAt: respData.createAT,
            },
            ...items,
          ]
      )

      return
    }
    if (kind === 'product') {
      const formData = new FormData();
      if (input.files) {
        formData.append("file", input.files);
      }
      formData.append(
        "data",
        new Blob(
          [
            JSON.stringify({
              productNumber: input.productNumber || "",
              name: input.name,
              productType: input.productType || "",
              stock: input.stock || 0,
              price: input.price || 0
            })
          ],
          { type: "application/json" }
        )
      );


      const response = await fetch(import.meta.env.VITE_DIRECT_URI + "/insert/product", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const respData = await response.json();

      if (respData.status === "NLI") {
        alert("로그인이 되지 않았어요");
        return;
      } else if (respData.status === "NAI") {
        alert("운영자계정이 아니에요")
        return;
      } else if (respData.status === "NPI") {
        alert("물건정보가 없어요");
        return;
      } else if (respData.status === "NPS") {
        alert("물건정보가 저장에 오류가 있어요");
        return;
      }



      console.log(respData);
      setProducts((items) =>
        items.some((item) => item.productNumber === input.productNumber)
          ? items
          : [
            {
              id: respData.id,
              productNumber: respData.productNumber || '',
              name: respData.productName,
              productType: respData.productType || '',
              stock: respData.stock || 0,
              price: respData.productPrice || 0,
              image: respData.image,
              createdAt: respData.createAT,
            },
            ...items,
          ]
      )


    }

  }
  const updateCatalog = (kind: 'company' | 'product') => async (id: number, input: CatalogInput) => {
    if (kind === 'company') {
      const response = await fetch(import.meta.env.VITE_DIRECT_URI + "/motify/company", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          companyNumber: input.companyNumber || '',
          name: input.name,

        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const respData = await response.json();

      if (respData.status === "NLI") {
        alert("로그인이 되지 않았어요");
        return;
      } else if (respData.status === "NAI") {
        alert("운영자계정이 아니에요")
        return;
      } else if (respData.status === "NPI") {
        alert("물건정보가 없어요");
        return;
      }

      setCompanies((items) =>
        items.map((item) =>
          item.companyNumber === input.companyNumber
            ? {
              //...item,
              id: respData.id,
              companyNumber: respData.companyNumber,
              name: respData.companyName,

              createdAt: respData.createAT,
            }
            : item
        )
      )

      return
    }
    if (kind === 'product') {
      const formData = new FormData();
      if (input.files) {
        formData.append("file", input.files);
      }
      formData.append(
        "data",
        new Blob(
          [
            JSON.stringify({
              id: id,
              productNumber: input.productNumber || '',
              name: input.name,
              productType: input.productType || '',
              stock: input.stock || 0,
              price: input.price || 0,
              image: input.image,
            })
          ],
          { type: "application/json" }
        )
      );
      const response = await fetch(import.meta.env.VITE_DIRECT_URI + "/motify/product", {
        method: "PUT",
        credentials: "include",

        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const respData = await response.json();

      if (respData.status === "NLI") {
        alert("로그인이 되지 않았어요");
        return;
      } else if (respData.status === "NAI") {
        alert("운영자계정이 아니에요")
        return;
      } else if (respData.status === "NCI") {
        alert("회사정보가 없어요");
        return;
      }


      setProducts((items) =>
        items.map((item) =>
          item.productNumber === input.productNumber
            ? {
              //   ...item,
              id: respData.id,
              productNumber: respData.productNumber || '',
              name: respData.productName,
              productType: respData.productType || '',
              stock: respData.stock || 0,
              price: respData.productPrice || 0,
              image: respData.image,
              createdAt: respData.createAT,
            }
            : item
        )
      )
    }
  }
  const deleteCatalog = (kind: 'company' | 'product') => async (id: number) => {

    if (kind === 'company') {
      const response = await fetch(import.meta.env.VITE_DIRECT_URI + "/delete/company", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const respData = await response.json();

      if (respData.status === "NLI") {
        alert("로그인이 되지 않았어요");
        return;
      } else if (respData.status === "NAI") {
        alert("운영자계정이 아니에요")
        return;
      }

      setCompanies((items) => items.filter((item) => item.id !== id))
    } else {
      const response = await fetch(import.meta.env.VITE_DIRECT_URI + "/delete/product", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const respData = await response.json();

      if (respData.status === "NLI") {
        alert("로그인이 되지 않았어요");
        return;
      } else if (respData.status === "NAI") {
        alert("운영자계정이 아니에요")
        return;
      }

      setProducts((items) => items.filter((item) => item.id !== id))

    }


  }

  const content = useMemo(
    () =>
      tab === 'ledger' ? (
        <LedgerPage
          transactions={transactions}
          filter={filter}
          setFilter={setFilter}
          onAdd={(item) => { setTransactions((items) => [item]) }}
          onUpdate={(updated) =>
            setTransactions((items) => items.map((item) => (item.ccdate === updated.ccdate ? updated : item)))
          }
          onDelete={(delitem) => setTransactions((items) => items.filter((item) => item.ccdate !== delitem.ccdate))}
          companies={companies.map((item) => item.name)}
          products={products.map((item) => item.name)}
        />
      ) : tab === 'inventory' ? (
        <InventoryPage transactions={transactions} stockproducts={stockproducts} />
      ) : tab === 'settlement' ? (
        <SettlementPage transactions={transactions} />
      ) : (
        <CatalogPage
          kind={tab === 'company' ? 'company' : 'product'}
          items={tab === 'company' ? companies : products}
          onAdd={addCatalog(tab === 'company' ? 'company' : 'product')}
          onUpdate={updateCatalog(tab === 'company' ? 'company' : 'product')}
          onDelete={deleteCatalog(tab === 'company' ? 'company' : 'product')}
        />
      ),
    [tab, transactions, filter, companies, products]
  )


  return (
    <>
      <aside>
        <div className="brand">
          <span>∽</span> 물결
        </div>
        <div className="shop">
          우리 가게<small>매장 관리</small>
        </div>
        <nav>
          {(
            [
              ['ledger', '거래 내역', '▣'],
              ['inventory', '재고 현황', '◫'],
              ['settlement', '정산 리포트', '◔'],
              ['product', '물품 등록', '□'],
              ['company', '회사 등록', '◇'],
            ] as const
          ).map(([id, label, icon]) => (
            <button key={id} className={`nav ${tab === id ? 'on' : ''}`} onClick={() => setTab(id)}>
              <b>{icon}</b>
              {label}
            </button>
          ))}
        </nav>
        <div className="aside-bottom">
          {user ? (
            <button className="logout logout-action" onClick={logout}>
              로그아웃
            </button>
          ) : (
            <div className="auth-actions">
              <button className="login-button" onClick={() => setLoginOpen('login')}>
                로그인
              </button>
              <button className="signup-button" onClick={() => setLoginOpen('signup')}>
                회원가입
              </button>
            </div>
          )}
          <div className="user">
            <i>{user?.nickname?.[0] || '손'}</i>
            <span>
              {user?.nickname || '손님'}
              <small>{user?.kakaoId || '로그인 없이 이용 중'}</small>
            </span>
          </div>
        </div>
      </aside>


      <div className="content">{content}</div>
      {loginOpen && <SignupPage initialSignup={loginOpen === 'signup'} onClose={() => setLoginOpen(false)} />}
      <Routes>
        <Route path="/" element={<main />} />
        <Route
          path="/signup/:kakaoId"
          element={<SignupPage initialSignup={true} onClose={() => setLoginOpen(false)} />}
        />
        <Route
          path="/login/:kakaoId"
          element={<LoginPp />}
        />

      </Routes>
    </>
  )
}


function LoginPp() {

  const navigate = useNavigate();
  const { login, register, setUser, user, usernum, setUserNum } = useAuth()
  const { kakaoId } = useParams<{ kakaoId: string }>();

  const fetchLogin = async (name: string) => {
    const response = await fetch(import.meta.env.VITE_DIRECT_URI + "/oauth/kakao/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kakaoId: name,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const respData = await response.json();

    if (respData.status === "UKI") {
      alert("카카오아이디가 일치하지 않습니다.");
      return;
    } else if (respData.status === "UKF") {
      alert("카카오아이디를 찾을수 없습니다.");
      return;
    } else if (respData.status === "ULI") {
      alert("유저정보를 찾을수 없습니다.");
      return;
    }

    setUser(respData);
    var numb = usernum + 1;
    setUserNum(numb);
    navigate("/");
  }

  if (kakaoId) {

    fetchLogin(kakaoId);

  }


  return (
    <></>
  )
}


function SignupPage({ onClose, initialSignup }: { onClose: () => void; initialSignup: boolean }) {


  const { login, register } = useAuth()
  const [signup, setSignup] = useState(initialSignup)
  const [error, setError] = useState('')
  const { kakaoId } = useParams<{ kakaoId: string }>();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const result = signup
      ? register(

        data.get('typesPeo') as string,
        kakaoId as string,
      )
      : login(data.get('name') as string,)
    if (result) setError(result)
    else onClose()
  }
  return (
    <div className="overlay">
      <form className="modal auth-card" onSubmit={submit}>
        <div className="modal-head">
          <h2>{signup ? '회원가입' : '로그인'}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="form-grid">
          <label className={signup ? '' : 'name-field'}>
            타입
            <select name="typesPeo">
              <option value="sel">판매자</option>
              <option value="cust">구매자</option>
              <option value="adm">운영자</option>
            </select>
          </label>
        </div>
        <p className="auth-error">{error}</p>
        <button className="primary submit">{signup ? '회원가입' : '로그인'}</button>
        <button
          type="button"
          className="auth-toggle"
          onClick={() => {
            setSignup((value) => !value)
            setError('')
          }}
        >
          {signup ? '이미 계정이 있나요? 로그인' : '처음이신가요? 회원가입'}
        </button>
      </form>
    </div>
  )
}
