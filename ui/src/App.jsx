var contentnode = document.getElementById('contents');

function ProductRow({product}){
    return(
        <tr>
            <td>{product.name}</td>
            <td>${product.Price}</td>
            <td>{product.Category}</td>
            <td><a href={product.Image} target="blank">View</a></td>
        </tr>
    );
}

class ProductAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var form = document.forms.ProductAdd;
        const product = {
            Name: form.product.value,
            Price: form.price.value.slice(1),
            Category: form.category.value,
            Image: form.image.value,
        };
        const {createProduct} = this.props;
        createProduct(product);
        form.price.value = "$";
        form.product.value = "";
        form.image.value = "";
    }

    render() {
        return (
            <div>
                <form name="ProductAdd" onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor="category">Category </label>
                        <select name="category">
                            <option value="shirt">Shirts</option>
                            <option value="jeans">Jeans</option>
                            <option value="jacket">Jackets</option>
                            <option value="sweater">Sweaters</option>
                            <option value="accessories">Accessories</option>
                        </select><br />
                        <label htmlFor="price">Price Per Unit </label>
                        <input type="text" name="price" /><br />
                    </div>
                    <div>
                        <label htmlFor="product">Product</label>
                        <input type="text" name="product" /><br />
                        <label htmlFor="image">image </label>
                        <input type="text" name="image" /><br />
                    </div>
                    <button type="submit">Add Product</button>
                </form>
            </div>

        );
    }
}


function ProductTable(props) {
    const productRows = products.map(product => <ProductRow key={product.id} product={product} />);
    return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
                {productRows}
            </tbody>
        </table>
    );
}


class ProductList extends React.Component {

    constructor() {
        super();
        this.state = { products: [] };
        this.createProduct = this.createProduct.bind(this);
    }


    componentDidMount() {
        document.forms.ProductAdd.price.value = '$';
        this.loadData();
    }

    async loadData() {
        const query = `query{
            productList{
                id Name Price Image Category
            }
        }`;

        const response = await fetch(window.Event.UI_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const result = await response.json();
        this.setState({ products: result.data.productList })
    }

    async createProduct(product) {
        const newProducts = product;
        const query = `mutation {
            productAdd(product:{
              Name: "${newProduct.Name}",
              Price: ${newProduct.Price},
              Image: "${newProduct.Image}",
              Category: ${newProduct.Category},
            }) {
              _id
            }
          }`;
          await fetch(window.Event.UI_API_ENDPOINT, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ query}),
          });
          this.loadData();
    }

    render() {
        const { products } = this.state;
        return (
            <div>
                <h1>My Company Inventory</h1>
                <div>Showing all available products</div>
                <hr /><br />
                <ProductTable products={products} />
                <br />
                <div>Add a new product to inventory</div>
                <hr /><br />
                <ProductAdd createProduct={this.createProduct} />
            </div>
        );
    }
}

ReactDOM.render(<ProductList />, contentnode);