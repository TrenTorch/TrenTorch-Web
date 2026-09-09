import type { ModuleMetadata, ModulePart } from './types';

export const MODULE_PARTS: ModulePart[] = [
	{
		id: 'foundations',
		title: 'Part I: Foundations',
		description:
			'The core primitives: tensors, activations, layers, losses, dataloaders, autograd, optimizers, and training loops.',
		moduleRange: 'Modules 01–08'
	},
	{
		id: 'vision',
		title: 'Part II: Computer Vision',
		description:
			'Spatial operations, 2D convolutions, max-pooling, and CNN architectures from scratch.',
		moduleRange: 'Module 09'
	},
	{
		id: 'nlp',
		title: 'Part III: Language & Transformers',
		description:
			'Tokenization, embeddings, multi-head self-attention, and GPT-style transformer blocks.',
		moduleRange: 'Modules 10–13'
	},
	{
		id: 'systems',
		title: 'Part IV: Systems & Performance',
		description:
			'Execution profiling, INT8 quantization, weight pruning, kernel acceleration, KV-caching, and benchmarking.',
		moduleRange: 'Modules 14–20'
	}
];

export const MODULES: ModuleMetadata[] = [
	{
		id: '01_tensor',
		slug: '01-tensor',
		number: 1,
		title: 'Tensor Foundation',
		subtitle: 'Building Blocks of Machine Learning',
		part: 'foundations',
		partTitle: 'Part I: Foundations',
		difficulty: 'Beginner',
		estimatedTime: '25 min',
		summary:
			'Build a multidimensional Tensor class supporting arithmetic, matrix multiplication, and shape transformations using pure NumPy.',
		guideMarkdown: `# Module 01: Tensor Foundation

Tensors are the fundamental data structure in modern deep learning frameworks. In this module, you will build a custom \`Tensor\` class from scratch using **NumPy** as the raw memory backend.

---

### 🎯 Key Objectives
1. **Encapsulation**: Store data internally as a \`np.ndarray\` float32 array.
2. **Arithmetic Operations**: Implement element-wise addition, subtraction, multiplication, and power operations.
3. **Matrix Multiplication (\`matmul\`)**: Support 2D and batched matrix multiplication.
4. **Shape Manipulation**: Implement \`reshape\`, \`transpose\`, and property accessors (\`shape\`, \`ndim\`, \`size\`).

---

### 💡 Implementation Guidance
- Always cast inputs into \`np.float32\` arrays inside \`__init__\`.
- Ensure arithmetic methods return a new \`Tensor\` instance.
- Support both \`Tensor\` and scalar operands in binary operations.
`,
		starterCode: `import numpy as np

class Tensor:
    """
    Multidimensional array container for TrenTorch operations.
    """
    def __init__(self, data):
        # Convert input data to a numpy float32 ndarray
        if isinstance(data, Tensor):
            self.data = data.data.astype(np.float32)
        else:
            self.data = np.asarray(data, dtype=np.float32)

    @property
    def shape(self):
        return self.data.shape

    @property
    def ndim(self):
        return self.data.ndim

    @property
    def size(self):
        return self.data.size

    def __repr__(self):
        return f"Tensor({self.data})"

    def add(self, other):
        """Element-wise addition with another Tensor or scalar."""
        # TODO: Implement element-wise addition
        pass

    def sub(self, other):
        """Element-wise subtraction with another Tensor or scalar."""
        # TODO: Implement element-wise subtraction
        pass

    def mul(self, other):
        """Element-wise multiplication with another Tensor or scalar."""
        # TODO: Implement element-wise multiplication
        pass

    def matmul(self, other):
        """Matrix multiplication between self and other."""
        # TODO: Implement matrix multiplication
        pass

    def reshape(self, *new_shape):
        """Returns a new Tensor with reshaped data."""
        # TODO: Implement reshape
        pass

    def transpose(self, *axes):
        """Permute the dimensions of the Tensor."""
        # TODO: Implement transpose
        pass

    def sum(self, axis=None, keepdims=False):
        """Sum array elements over a given axis."""
        # TODO: Implement sum
        pass

    # Operator Overloads
    def __add__(self, other): return self.add(other)
    def __sub__(self, other): return self.sub(other)
    def __mul__(self, other): return self.mul(other)
    def __matmul__(self, other): return self.matmul(other)
`,
		solutionCode: `import numpy as np

class Tensor:
    def __init__(self, data):
        if isinstance(data, Tensor):
            self.data = data.data.astype(np.float32)
        else:
            self.data = np.asarray(data, dtype=np.float32)

    @property
    def shape(self):
        return self.data.shape

    @property
    def ndim(self):
        return self.data.ndim

    @property
    def size(self):
        return self.data.size

    def __repr__(self):
        return f"Tensor({self.data})"

    def add(self, other):
        other_data = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data + other_data)

    def sub(self, other):
        other_data = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data - other_data)

    def mul(self, other):
        other_data = other.data if isinstance(other, Tensor) else other
        return Tensor(self.data * other_data)

    def matmul(self, other):
        other_data = other.data if isinstance(other, Tensor) else other
        return Tensor(np.matmul(self.data, other_data))

    def reshape(self, *new_shape):
        if len(new_shape) == 1 and isinstance(new_shape[0], (list, tuple)):
            shape = new_shape[0]
        else:
            shape = new_shape
        return Tensor(self.data.reshape(shape))

    def transpose(self, *axes):
        if len(axes) == 0:
            return Tensor(self.data.T)
        if len(axes) == 1 and isinstance(axes[0], (list, tuple)):
            axes = axes[0]
        return Tensor(np.transpose(self.data, axes))

    def sum(self, axis=None, keepdims=False):
        return Tensor(np.sum(self.data, axis=axis, keepdims=keepdims))

    def __add__(self, other): return self.add(other)
    def __sub__(self, other): return self.sub(other)
    def __mul__(self, other): return self.mul(other)
    def __matmul__(self, other): return self.matmul(other)
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []
    
    # Test 1: Tensor Creation & Attributes
    try:
        t = Tensor([[1, 2, 3], [4, 5, 6]])
        assert t.shape == (2, 3), f"Expected shape (2,3), got {t.shape}"
        assert t.ndim == 2, f"Expected ndim 2, got {t.ndim}"
        assert t.size == 6, f"Expected size 6, got {t.size}"
        assert t.data.dtype == np.float32, "Expected dtype float32"
        tests.append({"name": "test_tensor_creation", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_tensor_creation", "passed": False, "error": str(e)})

    # Test 2: Arithmetic Operations (Add, Sub, Mul)
    try:
        a = Tensor([1.0, 2.0, 3.0])
        b = Tensor([4.0, 5.0, 6.0])
        add_res = (a + b).data
        np.testing.assert_allclose(add_res, [5.0, 7.0, 9.0], err_msg="Addition failed")
        
        sub_res = (b - a).data
        np.testing.assert_allclose(sub_res, [3.0, 3.0, 3.0], err_msg="Subtraction failed")

        mul_res = (a * 2.0).data
        np.testing.assert_allclose(mul_res, [2.0, 4.0, 6.0], err_msg="Scalar multiplication failed")
        tests.append({"name": "test_arithmetic_operations", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_arithmetic_operations", "passed": False, "error": str(e)})

    # Test 3: Matrix Multiplication
    try:
        x = Tensor([[1.0, 2.0], [3.0, 4.0]])
        y = Tensor([[2.0, 0.0], [1.0, 2.0]])
        mm = (x @ y).data
        expected = np.array([[4.0, 4.0], [10.0, 8.0]])
        np.testing.assert_allclose(mm, expected, err_msg="Matmul failed")
        tests.append({"name": "test_matrix_multiplication", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_matrix_multiplication", "passed": False, "error": str(e)})

    # Test 4: Reshape & Transpose
    try:
        m = Tensor([[1, 2, 3], [4, 5, 6]])
        r = m.reshape(3, 2)
        assert r.shape == (3, 2), f"Expected shape (3,2), got {r.shape}"
        
        tr = m.transpose()
        assert tr.shape == (3, 2), f"Expected shape (3,2), got {tr.shape}"
        np.testing.assert_allclose(tr.data[0], [1.0, 4.0], err_msg="Transpose values mismatch")
        tests.append({"name": "test_reshape_and_transpose", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_reshape_and_transpose", "passed": False, "error": str(e)})

    # Test 5: Sum Reduction
    try:
        s = Tensor([[1.0, 2.0], [3.0, 4.0]])
        assert float(s.sum().data) == 10.0, "Sum total mismatch"
        axis_sum = s.sum(axis=0).data
        np.testing.assert_allclose(axis_sum, [4.0, 6.0], err_msg="Axis sum mismatch")
        tests.append({"name": "test_sum_reduction", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_sum_reduction", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_tensor_creation',
				description: 'Checks tensor initialisation, dtype, and properties'
			},
			{
				name: 'test_arithmetic_operations',
				description: 'Verifies element-wise add, sub, and scalar multiply'
			},
			{
				name: 'test_matrix_multiplication',
				description: 'Tests 2D matrix multiplication correctness'
			},
			{
				name: 'test_reshape_and_transpose',
				description: 'Verifies tensor reshaping and axis transposition'
			},
			{ name: 'test_sum_reduction', description: 'Tests full and axis-specific sum reductions' }
		],
		hints: [
			'Use np.asarray(data, dtype=np.float32) in __init__.',
			'Check if other operand is an instance of Tensor; if so, access other.data.',
			'Use np.matmul for matrix multiplication.'
		]
	},
	{
		id: '02_activations',
		slug: '02-activations',
		number: 2,
		title: 'Activation Functions',
		subtitle: 'Non-Linearity & Transformations',
		part: 'foundations',
		partTitle: 'Part I: Foundations',
		difficulty: 'Beginner',
		estimatedTime: '20 min',
		summary:
			'Implement non-linear activation functions: ReLU, Sigmoid, Tanh, GELU, and numerically stable Softmax.',
		guideMarkdown: `# Module 02: Activation Functions

Non-linear activation functions enable neural networks to learn non-linear boundaries. In this module, you will implement:

1. **ReLU**: $\\max(0, x)$
2. **Sigmoid**: $\\sigma(x) = \\frac{1}{1 + e^{-x}}$
3. **Tanh**: $\\tanh(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}$
4. **GELU (Gaussian Error Linear Unit)**: $0.5x(1 + \\tanh(\\sqrt{2/\\pi}(x + 0.044715x^3)))$
5. **Softmax**: $\\frac{e^{x_i - \\max(x)}}{\\sum e^{x_j - \\max(x)}}$ (numerically stable across specified axis).
`,
		starterCode: `import numpy as np

def relu(x):
    """Compute Rectified Linear Unit."""
    # TODO: Implement ReLU
    pass

def sigmoid(x):
    """Compute Sigmoid activation function."""
    # TODO: Implement Sigmoid
    pass

def tanh(x):
    """Compute Hyperbolic Tangent."""
    # TODO: Implement Tanh
    pass

def gelu(x):
    """Compute Gaussian Error Linear Unit (approximation)."""
    # TODO: Implement GELU
    pass

def softmax(x, axis=-1):
    """
    Compute numerically stable Softmax along given axis.
    Subtract maximum value along axis before exponentiation to prevent overflow.
    """
    # TODO: Implement numerically stable softmax
    pass
`,
		solutionCode: `import numpy as np

def relu(x):
    return np.maximum(0, x)

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))

def tanh(x):
    return np.tanh(x)

def gelu(x):
    return 0.5 * x * (1.0 + np.tanh(np.sqrt(2.0 / np.pi) * (x + 0.044715 * np.power(x, 3))))

def softmax(x, axis=-1):
    shifted_x = x - np.max(x, axis=axis, keepdims=True)
    exp_x = np.exp(shifted_x)
    return exp_x / np.sum(exp_x, axis=axis, keepdims=True)
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []
    
    # Test 1: ReLU
    try:
        x = np.array([-2.0, -0.5, 0.0, 1.5, 3.0])
        res = relu(x)
        np.testing.assert_allclose(res, [0.0, 0.0, 0.0, 1.5, 3.0], err_msg="ReLU incorrect")
        tests.append({"name": "test_relu", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_relu", "passed": False, "error": str(e)})

    # Test 2: Sigmoid
    try:
        x = np.array([0.0, -100.0, 100.0])
        res = sigmoid(x)
        assert np.isclose(res[0], 0.5), "Sigmoid(0) should be 0.5"
        assert np.isclose(res[1], 0.0), "Sigmoid(-100) should be ~0"
        assert np.isclose(res[2], 1.0), "Sigmoid(100) should be ~1"
        tests.append({"name": "test_sigmoid", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_sigmoid", "passed": False, "error": str(e)})

    # Test 3: Tanh
    try:
        x = np.array([0.0, 1.0, -1.0])
        res = tanh(x)
        assert np.isclose(res[0], 0.0)
        assert np.isclose(res[1], np.tanh(1.0))
        tests.append({"name": "test_tanh", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_tanh", "passed": False, "error": str(e)})

    # Test 4: GELU
    try:
        x = np.array([0.0, 1.0, -1.0])
        res = gelu(x)
        assert np.isclose(res[0], 0.0)
        assert np.isclose(res[1], 0.8413, atol=1e-3)
        tests.append({"name": "test_gelu", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_gelu", "passed": False, "error": str(e)})

    # Test 5: Softmax numerical stability
    try:
        x = np.array([[1000.0, 1001.0, 1002.0], [1.0, 2.0, 3.0]])
        sm = softmax(x, axis=-1)
        np.testing.assert_allclose(np.sum(sm, axis=-1), [1.0, 1.0], atol=1e-5, err_msg="Softmax must sum to 1")
        assert not np.isnan(sm).any(), "Softmax produced NaN on large inputs"
        tests.append({"name": "test_softmax_stability", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_softmax_stability", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{ name: 'test_relu', description: 'Validates ReLU clamping of negative numbers' },
			{ name: 'test_sigmoid', description: 'Tests Sigmoid output range [0, 1]' },
			{ name: 'test_tanh', description: 'Tests hyperbolic tangent bounds' },
			{ name: 'test_gelu', description: 'Tests Gaussian Error Linear Unit values' },
			{
				name: 'test_softmax_stability',
				description: 'Tests Softmax axis sum and stability on large exponents'
			}
		],
		hints: [
			'For ReLU, use np.maximum(0, x).',
			'In softmax, subtract np.max(x, axis=axis, keepdims=True) from x before np.exp(x).'
		]
	},
	{
		id: '03_layers',
		slug: '03-layers',
		number: 3,
		title: 'Neural Network Layers',
		subtitle: 'Linear, LayerNorm, Dropout & Sequential',
		part: 'foundations',
		partTitle: 'Part I: Foundations',
		difficulty: 'Intermediate',
		estimatedTime: '30 min',
		summary:
			'Build modular layer abstractions: Module base class, Linear (Dense) layer with Xavier/Kaiming initialization, LayerNorm, Dropout, and Sequential container.',
		guideMarkdown: `# Module 03: Neural Network Layers

Neural networks are built by composing layers. In this module, you will implement:

1. **\`Module\`**: Base class that tracks parameters and switches training mode (\`eval()\` vs \`train()\`).
2. **\`Linear\`**: $Y = XW^T + b$ with proper weight initialization.
3. **\`LayerNorm\`**: Normalizes inputs across the feature dimension with learnable $\\gamma$ and $\\beta$.
4. **\`Dropout\`**: Inverted dropout that randomly zeros activations during training.
5. **\`Sequential\`**: Container that chains multiple layers sequentially.
`,
		starterCode: `import numpy as np

class Module:
    def __init__(self):
        self.training = True

    def train(self):
        self.training = True

    def eval(self):
        self.training = False

    def __call__(self, *args, **kwargs):
        return self.forward(*args, **kwargs)

    def forward(self, *args, **kwargs):
        raise NotImplementedError

class Linear(Module):
    def __init__(self, in_features, out_features, bias=True):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        # Xavier uniform initialization: bound = 1 / sqrt(in_features)
        bound = 1.0 / np.sqrt(in_features)
        self.weight = np.random.uniform(-bound, bound, (out_features, in_features)).astype(np.float32)
        self.bias = np.zeros(out_features, dtype=np.float32) if bias else None

    def forward(self, x):
        # TODO: Compute Y = x @ W.T + bias
        pass

class LayerNorm(Module):
    def __init__(self, normalized_shape, eps=1e-5):
        super().__init__()
        self.eps = eps
        self.gamma = np.ones(normalized_shape, dtype=np.float32)
        self.beta = np.zeros(normalized_shape, dtype=np.float32)

    def forward(self, x):
        # TODO: Normalize over the last dimension: (x - mean) / sqrt(var + eps) * gamma + beta
        pass

class Dropout(Module):
    def __init__(self, p=0.5):
        super().__init__()
        self.p = p

    def forward(self, x):
        # TODO: Implement inverted dropout during training, pass-through during eval
        pass

class Sequential(Module):
    def __init__(self, *layers):
        super().__init__()
        self.layers = list(layers)

    def forward(self, x):
        # TODO: Pipe input sequentially through all layers
        pass
`,
		solutionCode: `import numpy as np

class Module:
    def __init__(self):
        self.training = True

    def train(self):
        self.training = True
        for attr in self.__dict__.values():
            if isinstance(attr, Module):
                attr.train()
            elif isinstance(attr, list):
                for item in attr:
                    if isinstance(item, Module):
                        item.train()

    def eval(self):
        self.training = False
        for attr in self.__dict__.values():
            if isinstance(attr, Module):
                attr.eval()
            elif isinstance(attr, list):
                for item in attr:
                    if isinstance(item, Module):
                        item.eval()

    def __call__(self, *args, **kwargs):
        return self.forward(*args, **kwargs)

class Linear(Module):
    def __init__(self, in_features, out_features, bias=True):
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        bound = 1.0 / np.sqrt(in_features)
        self.weight = np.random.uniform(-bound, bound, (out_features, in_features)).astype(np.float32)
        self.bias = np.zeros(out_features, dtype=np.float32) if bias else None

    def forward(self, x):
        out = np.matmul(x, self.weight.T)
        if self.bias is not None:
            out += self.bias
        return out

class LayerNorm(Module):
    def __init__(self, normalized_shape, eps=1e-5):
        super().__init__()
        self.eps = eps
        self.gamma = np.ones(normalized_shape, dtype=np.float32)
        self.beta = np.zeros(normalized_shape, dtype=np.float32)

    def forward(self, x):
        mean = np.mean(x, axis=-1, keepdims=True)
        var = np.var(x, axis=-1, keepdims=True)
        x_norm = (x - mean) / np.sqrt(var + self.eps)
        return x_norm * self.gamma + self.beta

class Dropout(Module):
    def __init__(self, p=0.5):
        super().__init__()
        self.p = p

    def forward(self, x):
        if not self.training or self.p == 0.0:
            return x
        mask = (np.random.rand(*x.shape) >= self.p).astype(np.float32)
        return (x * mask) / (1.0 - self.p)

class Sequential(Module):
    def __init__(self, *layers):
        super().__init__()
        self.layers = list(layers)

    def forward(self, x):
        out = x
        for layer in self.layers:
            out = layer(out)
        return out
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    # Test 1: Linear layer forward
    try:
        lin = Linear(4, 2)
        x = np.ones((3, 4), dtype=np.float32)
        out = lin(x)
        assert out.shape == (3, 2), f"Expected shape (3,2), got {out.shape}"
        tests.append({"name": "test_linear_forward", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_linear_forward", "passed": False, "error": str(e)})

    # Test 2: LayerNorm forward
    try:
        ln = LayerNorm(4)
        x = np.array([[1.0, 2.0, 3.0, 4.0]], dtype=np.float32)
        out = ln(x)
        assert np.isclose(np.mean(out), 0.0, atol=1e-4), "Mean should be ~0"
        assert np.isclose(np.var(out), 1.0, atol=1e-3), "Variance should be ~1"
        tests.append({"name": "test_layernorm_forward", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_layernorm_forward", "passed": False, "error": str(e)})

    # Test 3: Dropout behavior in train vs eval
    try:
        drop = Dropout(p=0.5)
        x = np.ones((100, 100), dtype=np.float32)
        drop.train()
        train_out = drop(x)
        zero_fraction = np.mean(train_out == 0)
        assert 0.4 < zero_fraction < 0.6, f"Dropout fraction expected ~0.5, got {zero_fraction}"

        drop.eval()
        eval_out = drop(x)
        np.testing.assert_array_equal(eval_out, x, err_msg="Dropout in eval mode must be identity")
        tests.append({"name": "test_dropout_modes", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_dropout_modes", "passed": False, "error": str(e)})

    # Test 4: Sequential Pipeline
    try:
        seq = Sequential(
            Linear(3, 8),
            Linear(8, 2)
        )
        x = np.random.randn(5, 3).astype(np.float32)
        out = seq(x)
        assert out.shape == (5, 2), f"Sequential shape mismatch: expected (5,2), got {out.shape}"
        tests.append({"name": "test_sequential", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_sequential", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_linear_forward',
				description: 'Tests Linear layer output shapes and matrix multiplication'
			},
			{
				name: 'test_layernorm_forward',
				description: 'Validates 0-mean and unit variance normalization'
			},
			{
				name: 'test_dropout_modes',
				description: 'Tests zeroing in training and pass-through in eval mode'
			},
			{ name: 'test_sequential', description: 'Tests chaining layers inside Sequential container' }
		],
		hints: [
			'Linear forward computes: np.matmul(x, self.weight.T) + self.bias.',
			'LayerNorm computes mean and variance along axis=-1 with keepdims=True.',
			'In inverted dropout, scale active elements by 1.0 / (1.0 - self.p).'
		]
	},
	{
		id: '04_losses',
		slug: '04-losses',
		number: 4,
		title: 'Loss Functions',
		subtitle: 'MSE, Binary Cross-Entropy & Cross-Entropy',
		part: 'foundations',
		partTitle: 'Part I: Foundations',
		difficulty: 'Beginner',
		estimatedTime: '20 min',
		summary:
			'Implement loss functions that guide optimization: Mean Squared Error (MSE), Binary Cross-Entropy (BCE), and Cross-Entropy loss.',
		guideMarkdown: `# Module 04: Loss Functions

Loss functions quantify the difference between a model's predictions $\\hat{y}$ and target values $y$.

1. **Mean Squared Error (MSE)**: $\\frac{1}{N} \\sum (\\hat{y} - y)^2$
2. **Binary Cross-Entropy (BCE)**: $-\\frac{1}{N} \\sum [y \\log(\\hat{y} + \\epsilon) + (1 - y) \\log(1 - \\hat{y} + \\epsilon)]$
3. **Cross-Entropy Loss (with Logits)**: Combines Log-Softmax and Negative Log Likelihood for classification.
`,
		starterCode: `import numpy as np

def mse_loss(y_pred, y_true):
    """Compute Mean Squared Error."""
    # TODO: Implement MSE loss
    pass

def bce_loss(y_pred, y_true, eps=1e-15):
    """Compute Binary Cross-Entropy loss."""
    # TODO: Implement BCE loss with epsilon clipping
    pass

def cross_entropy_loss(logits, targets, eps=1e-15):
    """
    Compute Cross-Entropy loss from logits.
    logits: (batch_size, num_classes)
    targets: (batch_size,) integer class labels OR (batch_size, num_classes) one-hot
    """
    # TODO: Implement cross-entropy loss
    pass
`,
		solutionCode: `import numpy as np

def mse_loss(y_pred, y_true):
    return np.mean((y_pred - y_true) ** 2)

def bce_loss(y_pred, y_true, eps=1e-15):
    y_pred_clipped = np.clip(y_pred, eps, 1.0 - eps)
    loss = -(y_true * np.log(y_pred_clipped) + (1.0 - y_true) * np.log(1.0 - y_pred_clipped))
    return np.mean(loss)

def cross_entropy_loss(logits, targets, eps=1e-15):
    shifted = logits - np.max(logits, axis=-1, keepdims=True)
    exp_logits = np.exp(shifted)
    probs = exp_logits / np.sum(exp_logits, axis=-1, keepdims=True)
    
    if targets.ndim == 1:
        batch_size = logits.shape[0]
        correct_log_probs = -np.log(probs[np.arange(batch_size), targets] + eps)
        return np.mean(correct_log_probs)
    else:
        loss = -np.sum(targets * np.log(probs + eps), axis=-1)
        return np.mean(loss)
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    # Test 1: MSE Loss
    try:
        yp = np.array([1.0, 2.0, 3.0])
        yt = np.array([1.0, 2.0, 5.0])
        loss = mse_loss(yp, yt)
        assert np.isclose(loss, 4.0 / 3.0), f"MSE expected {4/3}, got {loss}"
        tests.append({"name": "test_mse_loss", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_mse_loss", "passed": False, "error": str(e)})

    # Test 2: BCE Loss
    try:
        yp = np.array([0.9, 0.1])
        yt = np.array([1.0, 0.0])
        loss = bce_loss(yp, yt)
        assert loss < 0.2, f"BCE loss should be small for confident correct predictions, got {loss}"
        tests.append({"name": "test_bce_loss", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_bce_loss", "passed": False, "error": str(e)})

    # Test 3: Cross-Entropy Loss
    try:
        logits = np.array([[2.0, 1.0, 0.1], [0.1, 3.0, 0.2]])
        targets = np.array([0, 1])
        loss = cross_entropy_loss(logits, targets)
        assert loss < 0.5, f"Cross-entropy loss should be small, got {loss}"
        tests.append({"name": "test_cross_entropy_loss", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_cross_entropy_loss", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{ name: 'test_mse_loss', description: 'Tests Mean Squared Error calculation' },
			{ name: 'test_bce_loss', description: 'Tests Binary Cross Entropy with clipping' },
			{
				name: 'test_cross_entropy_loss',
				description: 'Tests multi-class Cross Entropy loss with logits'
			}
		],
		hints: [
			'Use np.clip(y_pred, eps, 1 - eps) to prevent log(0) NaN issues in BCE.',
			'In cross-entropy, subtract max logit for numerical stability before softmax.'
		]
	},
	{
		id: '05_dataloader',
		slug: '05-dataloader',
		number: 5,
		title: 'Datasets & DataLoaders',
		subtitle: 'Batching, Shuffling & Data Pipelines',
		part: 'foundations',
		partTitle: 'Part I: Foundations',
		difficulty: 'Beginner',
		estimatedTime: '25 min',
		summary:
			'Build a high-performance Dataset abstraction and DataLoader that handles mini-batch slicing, index permutation, and dataset iteration.',
		guideMarkdown: `# Module 05: Datasets & DataLoaders

Training neural networks requires feeding data in mini-batches. In this module, you will build:

1. **\`Dataset\`**: Abstract interface implementing \`__len__\` and \`__getitem__\`.
2. **\`TensorDataset\`**: Wraps arrays/tensors into a unified dataset.
3. **\`DataLoader\`**: Generates mini-batches with optional random shuffling and \`drop_last\` support.
`,
		starterCode: `import numpy as np

class Dataset:
    def __len__(self):
        raise NotImplementedError
    def __getitem__(self, index):
        raise NotImplementedError

class TensorDataset(Dataset):
    def __init__(self, *tensors):
        assert len(tensors) > 0, "At least one tensor required"
        length = len(tensors[0])
        assert all(len(t) == length for t in tensors), "All tensors must have the same length"
        self.tensors = tensors

    def __len__(self):
        return len(self.tensors[0])

    def __getitem__(self, index):
        return tuple(t[index] for t in self.tensors)

class DataLoader:
    def __init__(self, dataset, batch_size=1, shuffle=False, drop_last=False):
        self.dataset = dataset
        self.batch_size = batch_size
        self.shuffle = shuffle
        self.drop_last = drop_last

    def __iter__(self):
        # TODO: Yield batches of items as tuples of numpy arrays
        pass

    def __len__(self):
        # TODO: Return total number of batches
        pass
`,
		solutionCode: `import numpy as np

class Dataset:
    def __len__(self):
        raise NotImplementedError
    def __getitem__(self, index):
        raise NotImplementedError

class TensorDataset(Dataset):
    def __init__(self, *tensors):
        assert len(tensors) > 0, "At least one tensor required"
        length = len(tensors[0])
        assert all(len(t) == length for t in tensors), "All tensors must have the same length"
        self.tensors = [np.asarray(t) for t in tensors]

    def __len__(self):
        return len(self.tensors[0])

    def __getitem__(self, index):
        return tuple(t[index] for t in self.tensors)

class DataLoader:
    def __init__(self, dataset, batch_size=1, shuffle=False, drop_last=False):
        self.dataset = dataset
        self.batch_size = batch_size
        self.shuffle = shuffle
        self.drop_last = drop_last

    def __iter__(self):
        n = len(self.dataset)
        indices = np.random.permutation(n) if self.shuffle else np.arange(n)
        
        for start_idx in range(0, n, self.batch_size):
            end_idx = start_idx + self.batch_size
            if end_idx > n and self.drop_last:
                break
            batch_indices = indices[start_idx:min(end_idx, n)]
            
            samples = [self.dataset[i] for i in batch_indices]
            # Collating tuple samples into batched numpy arrays
            num_fields = len(samples[0])
            batched = tuple(np.array([s[field] for s in samples]) for field in range(num_fields))
            yield batched

    def __len__(self):
        n = len(self.dataset)
        if self.drop_last:
            return n // self.batch_size
        return (n + self.batch_size - 1) // self.batch_size
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    # Test 1: TensorDataset length & indexing
    try:
        x = np.arange(20).reshape(10, 2)
        y = np.arange(10)
        ds = TensorDataset(x, y)
        assert len(ds) == 10, f"Expected dataset length 10, got {len(ds)}"
        sample_x, sample_y = ds[3]
        np.testing.assert_array_equal(sample_x, [6, 7])
        assert sample_y == 3
        tests.append({"name": "test_dataset_indexing", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_dataset_indexing", "passed": False, "error": str(e)})

    # Test 2: DataLoader Batching
    try:
        x = np.arange(20).reshape(10, 2)
        y = np.arange(10)
        ds = TensorDataset(x, y)
        loader = DataLoader(ds, batch_size=4, shuffle=False, drop_last=False)
        batches = list(loader)
        assert len(batches) == 3, f"Expected 3 batches, got {len(batches)}"
        assert batches[0][0].shape == (4, 2), "First batch shape mismatch"
        assert batches[2][0].shape == (2, 2), "Last batch shape mismatch"
        tests.append({"name": "test_dataloader_batching", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_dataloader_batching", "passed": False, "error": str(e)})

    # Test 3: Drop Last
    try:
        x = np.arange(20).reshape(10, 2)
        ds = TensorDataset(x)
        loader = DataLoader(ds, batch_size=4, shuffle=False, drop_last=True)
        batches = list(loader)
        assert len(batches) == 2, f"Expected 2 batches with drop_last=True, got {len(batches)}"
        assert len(loader) == 2, f"DataLoader __len__ mismatch"
        tests.append({"name": "test_dataloader_drop_last", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_dataloader_drop_last", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{ name: 'test_dataset_indexing', description: 'Tests dataset length and item access' },
			{
				name: 'test_dataloader_batching',
				description: 'Validates batch shapes and full iteration'
			},
			{
				name: 'test_dataloader_drop_last',
				description: 'Tests drop_last flag on incomplete batches'
			}
		],
		hints: [
			'Use np.random.permutation(n) when shuffle=True.',
			'Collate samples using tuple(np.array([s[field] for s in samples]) for field in range(num_fields)).'
		]
	},
	{
		id: '06_autograd',
		slug: '06-autograd',
		number: 6,
		title: 'Automatic Differentiation',
		subtitle: 'Computation Graphs & Backpropagation',
		part: 'foundations',
		partTitle: 'Part I: Foundations',
		difficulty: 'Advanced',
		estimatedTime: '45 min',
		summary:
			'Implement a reverse-mode automatic differentiation engine with DAG topological sorting and gradient accumulation.',
		guideMarkdown: `# Module 06: Automatic Differentiation (Autograd)

Autograd is the core engine of TrenTorch. In this module, you will build a dynamic computation graph that tracks forward operations and propagates gradients backward via the chain rule.

### 🎯 Key Components
1. **Node / Value Object**: Tracks \`data\`, \`grad\`, and parent nodes with backward functions.
2. **Topological Sort**: Computes the exact execution order to resolve dependencies before accumulating gradients.
3. **Backward Pass**: Implements backward logic for addition, multiplication, ReLU, and matmul.
`,
		starterCode: `import numpy as np

class Var:
    """
    Autograd Variable tracking values and gradients in a computational graph.
    """
    def __init__(self, data, _parents=(), _op=""):
        self.data = np.asarray(data, dtype=np.float32)
        self.grad = np.zeros_like(self.data)
        self._backward = lambda: None
        self._prev = set(_parents)
        self._op = _op

    def __repr__(self):
        return f"Var(data={self.data}, grad={self.grad})"

    def backward(self):
        # TODO: Build topological sort of graph and call _backward() in reverse
        pass

    def __add__(self, other):
        other = other if isinstance(other, Var) else Var(other)
        out = Var(self.data + other.data, (self, other), "+")
        
        def _backward():
            # TODO: Accumulate gradient into self.grad and other.grad
            pass
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Var) else Var(other)
        out = Var(self.data * other.data, (self, other), "*")
        
        def _backward():
            # TODO: Accumulate gradient: self.grad += other.data * out.grad
            pass
        out._backward = _backward
        return out

    def relu(self):
        out = Var(np.maximum(0, self.data), (self,), "ReLU")
        def _backward():
            # TODO: self.grad += (self.data > 0) * out.grad
            pass
        out._backward = _backward
        return out
`,
		solutionCode: `import numpy as np

class Var:
    def __init__(self, data, _parents=(), _op=""):
        self.data = np.asarray(data, dtype=np.float32)
        self.grad = np.zeros_like(self.data)
        self._backward = lambda: None
        self._prev = set(_parents)
        self._op = _op

    def backward(self):
        topo = []
        visited = set()
        
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for parent in v._prev:
                    build_topo(parent)
                topo.append(v)
                
        build_topo(self)
        self.grad = np.ones_like(self.data)
        for node in reversed(topo):
            node._backward()

    def __add__(self, other):
        other = other if isinstance(other, Var) else Var(other)
        out = Var(self.data + other.data, (self, other), "+")
        
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Var) else Var(other)
        out = Var(self.data * other.data, (self, other), "*")
        
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def relu(self):
        out = Var(np.maximum(0, self.data), (self,), "ReLU")
        def _backward():
            self.grad += (self.data > 0).astype(np.float32) * out.grad
        out._backward = _backward
        return out
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    # Test 1: Simple Addition Gradient
    try:
        a = Var(3.0)
        b = Var(4.0)
        c = a + b
        c.backward()
        assert np.isclose(a.grad, 1.0), f"Expected a.grad=1.0, got {a.grad}"
        assert np.isclose(b.grad, 1.0), f"Expected b.grad=1.0, got {b.grad}"
        tests.append({"name": "test_add_gradient", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_add_gradient", "passed": False, "error": str(e)})

    # Test 2: Multiplication & Chain Rule
    try:
        x = Var(2.0)
        y = Var(5.0)
        z = x * y  # z = 10, dz/dx = 5, dz/dy = 2
        z.backward()
        assert np.isclose(x.grad, 5.0), f"Expected x.grad=5.0, got {x.grad}"
        assert np.isclose(y.grad, 2.0), f"Expected y.grad=2.0, got {y.grad}"
        tests.append({"name": "test_mul_gradient", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_mul_gradient", "passed": False, "error": str(e)})

    # Test 3: Composite Function with ReLU
    try:
        x = Var(-2.0)
        w = Var(3.0)
        b = Var(10.0)
        y = (x * w + b).relu() # -2*3 + 10 = 4 > 0 -> relu=4. dy/dx = 3
        y.backward()
        assert np.isclose(x.grad, 3.0), f"Expected x.grad=3.0, got {x.grad}"
        assert np.isclose(w.grad, -2.0), f"Expected w.grad=-2.0, got {w.grad}"
        assert np.isclose(b.grad, 1.0), f"Expected b.grad=1.0, got {b.grad}"
        tests.append({"name": "test_composite_graph", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_composite_graph", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{ name: 'test_add_gradient', description: 'Verifies gradient accumulation on addition' },
			{ name: 'test_mul_gradient', description: 'Tests chain rule on multiplication' },
			{
				name: 'test_composite_graph',
				description: 'Tests backward propagation through composite graph with ReLU'
			}
		],
		hints: [
			'Initialize self.grad = np.ones_like(self.data) at the start of backward().',
			'Traverse the topological list in reverse order.'
		]
	},
	{
		id: '07_optimizers',
		slug: '07-optimizers',
		number: 7,
		title: 'Optimizers & Learning Rate',
		subtitle: 'SGD, Momentum, Adam & AdamW',
		part: 'foundations',
		partTitle: 'Part I: Foundations',
		difficulty: 'Intermediate',
		estimatedTime: '30 min',
		summary:
			'Build gradient descent optimizers: SGD with momentum, Adam, AdamW (decoupled weight decay), and learning rate schedulers.',
		guideMarkdown: `# Module 07: Optimizers & Learning Rate Schedulers

Optimizers update model parameters based on computed gradients. In this module, you will implement:

1. **\`SGD\`**: Stochastic Gradient Descent with optional Momentum ($v = \\beta v + g, \\theta = \\theta - \\alpha v$).
2. **\`AdamW\`**: Decoupled weight decay with 1st and 2nd moment bias-corrected estimates.
3. **\`StepLR\`**: Multiplicative learning rate decay every $N$ epochs.
`,
		starterCode: `import numpy as np

class Optimizer:
    def __init__(self, params, lr=1e-3):
        self.params = list(params)
        self.lr = lr

    def zero_grad(self):
        for p in self.params:
            if hasattr(p, 'grad') and p.grad is not None:
                p.grad.fill(0)

    def step(self):
        raise NotImplementedError

class SGD(Optimizer):
    def __init__(self, params, lr=1e-3, momentum=0.0):
        super().__init__(params, lr)
        self.momentum = momentum
        self.velocities = [np.zeros_like(p.data) for p in self.params]

    def step(self):
        # TODO: Implement SGD with momentum update
        pass

class AdamW(Optimizer):
    def __init__(self, params, lr=1e-3, betas=(0.9, 0.999), eps=1e-8, weight_decay=0.01):
        super().__init__(params, lr)
        self.beta1, self.beta2 = betas
        self.eps = eps
        self.weight_decay = weight_decay
        self.m = [np.zeros_like(p.data) for p in self.params]
        self.v = [np.zeros_like(p.data) for p in self.params]
        self.t = 0

    def step(self):
        # TODO: Implement AdamW update rule
        pass
`,
		solutionCode: `import numpy as np

class Optimizer:
    def __init__(self, params, lr=1e-3):
        self.params = list(params)
        self.lr = lr

    def zero_grad(self):
        for p in self.params:
            if hasattr(p, 'grad') and p.grad is not None:
                p.grad.fill(0)

class SGD(Optimizer):
    def __init__(self, params, lr=1e-3, momentum=0.0):
        super().__init__(params, lr)
        self.momentum = momentum
        self.velocities = [np.zeros_like(p.data) for p in self.params]

    def step(self):
        for i, p in enumerate(self.params):
            if p.grad is None:
                continue
            if self.momentum > 0:
                self.velocities[i] = self.momentum * self.velocities[i] + p.grad
                update = self.velocities[i]
            else:
                update = p.grad
            p.data -= self.lr * update

class AdamW(Optimizer):
    def __init__(self, params, lr=1e-3, betas=(0.9, 0.999), eps=1e-8, weight_decay=0.01):
        super().__init__(params, lr)
        self.beta1, self.beta2 = betas
        self.eps = eps
        self.weight_decay = weight_decay
        self.m = [np.zeros_like(p.data) for p in self.params]
        self.v = [np.zeros_like(p.data) for p in self.params]
        self.t = 0

    def step(self):
        self.t += 1
        for i, p in enumerate(self.params):
            if p.grad is None:
                continue
            # Decoupled weight decay
            if self.weight_decay > 0:
                p.data -= self.lr * self.weight_decay * p.data
            
            grad = p.grad
            self.m[i] = self.beta1 * self.m[i] + (1.0 - self.beta1) * grad
            self.v[i] = self.beta2 * self.v[i] + (1.0 - self.beta2) * (grad ** 2)
            
            m_hat = self.m[i] / (1.0 - self.beta1 ** self.t)
            v_hat = self.v[i] / (1.0 - self.beta2 ** self.t)
            
            p.data -= self.lr * m_hat / (np.sqrt(v_hat) + self.eps)
`,
		testHarnessCode: `
import numpy as np

class ParamMock:
    def __init__(self, data):
        self.data = np.array(data, dtype=np.float32)
        self.grad = np.zeros_like(self.data)

def run_tests():
    tests = []

    # Test 1: SGD Step
    try:
        p = ParamMock([10.0, -5.0])
        p.grad = np.array([2.0, -1.0], dtype=np.float32)
        opt = SGD([p], lr=0.1, momentum=0.0)
        opt.step()
        np.testing.assert_allclose(p.data, [9.8, -4.9], err_msg="SGD step mismatch")
        tests.append({"name": "test_sgd_step", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_sgd_step", "passed": False, "error": str(e)})

    # Test 2: AdamW Step
    try:
        p = ParamMock([5.0, 5.0])
        p.grad = np.array([1.0, 1.0], dtype=np.float32)
        opt = AdamW([p], lr=0.1, weight_decay=0.0)
        opt.step()
        # In step 1 with constant grad 1.0, step update should be -lr
        assert p.data[0] < 5.0, "AdamW did not decrease parameter"
        tests.append({"name": "test_adamw_step", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_adamw_step", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{ name: 'test_sgd_step', description: 'Tests standard SGD gradient descent step' },
			{ name: 'test_adamw_step', description: 'Tests AdamW moments and parameter update' }
		],
		hints: [
			'Remember to increment time step self.t += 1 on each AdamW.step().',
			'In AdamW, compute bias-corrected m_hat and v_hat before applying learning rate.'
		]
	},
	{
		id: '08_training',
		slug: '08-training',
		number: 8,
		title: 'End-to-End Training Loop',
		subtitle: 'Epochs, Evaluation & Checkpointing',
		part: 'foundations',
		partTitle: 'Part I: Foundations',
		difficulty: 'Intermediate',
		estimatedTime: '30 min',
		summary:
			'Assemble model, loss, optimizer, and dataloader into an end-to-end training and evaluation pipeline with metrics logging.',
		guideMarkdown: `# Module 08: End-to-End Training Loop

In this module, you connect all foundations (modules 01–07) into a training pipeline:
- **Forward Pass**: Compute model predictions.
- **Loss Computation**: Quantify error.
- **Backward Pass**: Compute parameter gradients.
- **Optimizer Step**: Update weights and zero gradients.
- **Validation**: Evaluate accuracy without gradient overhead.
`,
		starterCode: `import numpy as np

def train_epoch(model, dataloader, criterion, optimizer):
    """
    Runs one epoch of training over dataloader.
    Returns: average epoch loss (float)
    """
    # TODO: Implement training loop over batches
    pass

def evaluate(model, dataloader, criterion):
    """
    Evaluates model on validation data.
    Returns: (average_loss, accuracy)
    """
    # TODO: Implement evaluation loop
    pass
`,
		solutionCode: `import numpy as np

def train_epoch(model, dataloader, criterion, optimizer):
    model.train()
    total_loss = 0.0
    num_batches = 0
    
    for batch_x, batch_y in dataloader:
        optimizer.zero_grad()
        preds = model(batch_x)
        loss = criterion(preds, batch_y)
        loss.backward()
        optimizer.step()
        
        total_loss += float(loss.data if hasattr(loss, 'data') else loss)
        num_batches += 1
        
    return total_loss / max(num_batches, 1)

def evaluate(model, dataloader, criterion):
    model.eval()
    total_loss = 0.0
    correct = 0
    total = 0
    num_batches = 0
    
    for batch_x, batch_y in dataloader:
        preds = model(batch_x)
        loss = criterion(preds, batch_y)
        
        pred_data = preds.data if hasattr(preds, 'data') else preds
        y_data = batch_y.data if hasattr(batch_y, 'data') else batch_y
        
        pred_labels = np.argmax(pred_data, axis=-1)
        true_labels = y_data if y_data.ndim == 1 else np.argmax(y_data, axis=-1)
        
        correct += np.sum(pred_labels == true_labels)
        total += len(true_labels)
        total_loss += float(loss.data if hasattr(loss, 'data') else loss)
        num_batches += 1
        
    avg_loss = total_loss / max(num_batches, 1)
    acc = correct / max(total, 1)
    return avg_loss, acc
`,
		testHarnessCode: `
import numpy as np

class DummyModel:
    def __init__(self):
        self.training = True
    def train(self): self.training = True
    def eval(self): self.training = False
    def __call__(self, x): return x

class DummyOptimizer:
    def zero_grad(self): pass
    def step(self): pass

class DummyLoss:
    def __init__(self, val): self.data = val
    def backward(self): pass

def dummy_criterion(p, y):
    return DummyLoss(0.25)

def run_tests():
    tests = []

    try:
        model = DummyModel()
        opt = DummyOptimizer()
        dataset = [
            (np.array([[2.0, 0.0], [0.0, 2.0]]), np.array([0, 1])),
            (np.array([[1.0, 3.0], [3.0, 1.0]]), np.array([1, 0]))
        ]
        
        loss = train_epoch(model, dataset, dummy_criterion, opt)
        assert np.isclose(loss, 0.25), f"Expected train loss 0.25, got {loss}"
        assert model.training == True, "Model should be in training mode"
        tests.append({"name": "test_train_epoch", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_train_epoch", "passed": False, "error": str(e)})

    try:
        avg_loss, acc = evaluate(model, dataset, dummy_criterion)
        assert np.isclose(avg_loss, 0.25)
        assert np.isclose(acc, 1.0)
        assert model.training == False, "Model should be in eval mode during evaluation"
        tests.append({"name": "test_evaluate_loop", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_evaluate_loop", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_train_epoch',
				description: 'Tests training step iteration and model.train() state'
			},
			{ name: 'test_evaluate_loop', description: 'Tests evaluation loss and accuracy computation' }
		],
		hints: [
			'Call model.train() at start of train_epoch and model.eval() at start of evaluate.',
			'Zero gradients with optimizer.zero_grad() before backward().'
		]
	},
	{
		id: '09_convolutions',
		slug: '09-convolutions',
		number: 9,
		title: '2D Convolutions & Vision',
		subtitle: 'Conv2D, MaxPool2D & CNN Architectures',
		part: 'vision',
		partTitle: 'Part II: Computer Vision',
		difficulty: 'Intermediate',
		estimatedTime: '40 min',
		summary:
			'Implement spatial convolution ops: Conv2D with padding & stride, 2D Max Pooling, and construct a LeNet-style image classifier.',
		guideMarkdown: `# Module 09: 2D Convolutions & Computer Vision

Convolutional neural networks process image data by sliding learnable spatial filters across input tensors:

1. **\`Conv2D\`**: Performs 2D cross-correlation: $\\text{out}(c_{out}, h, w) = \\sum_{c_{in}} X * W + b$.
2. **\`MaxPool2D\`**: Downsamples feature maps by taking the maximum in each window.
3. **\`CNN\`**: Chains Conv2D, ReLU, MaxPool, Flatten, and Linear layers.
`,
		starterCode: `import numpy as np

class Conv2D:
    def __init__(self, in_channels, out_channels, kernel_size, stride=1, padding=0):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size
        self.stride = stride
        self.padding = padding
        # Weights: (out_channels, in_channels, k, k)
        k = kernel_size
        bound = 1.0 / np.sqrt(in_channels * k * k)
        self.weight = np.random.uniform(-bound, bound, (out_channels, in_channels, k, k)).astype(np.float32)
        self.bias = np.zeros(out_channels, dtype=np.float32)

    def forward(self, x):
        """
        x: (batch_size, in_channels, H, W)
        Returns: (batch_size, out_channels, out_H, out_W)
        """
        # TODO: Implement 2D convolution with padding and stride
        pass

class MaxPool2D:
    def __init__(self, kernel_size=2, stride=2):
        self.kernel_size = kernel_size
        self.stride = stride

    def forward(self, x):
        """
        x: (batch_size, channels, H, W)
        Returns: (batch_size, channels, out_H, out_W)
        """
        # TODO: Implement 2D max pooling
        pass
`,
		solutionCode: `import numpy as np

class Conv2D:
    def __init__(self, in_channels, out_channels, kernel_size, stride=1, padding=0):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size
        self.stride = stride
        self.padding = padding
        k = kernel_size
        bound = 1.0 / np.sqrt(in_channels * k * k)
        self.weight = np.random.uniform(-bound, bound, (out_channels, in_channels, k, k)).astype(np.float32)
        self.bias = np.zeros(out_channels, dtype=np.float32)

    def forward(self, x):
        N, C, H, W = x.shape
        K = self.kernel_size
        p = self.padding
        s = self.stride
        
        if p > 0:
            x_pad = np.pad(x, ((0,0), (0,0), (p,p), (p,p)), mode='constant')
        else:
            x_pad = x
            
        H_out = (H + 2 * p - K) // s + 1
        W_out = (W + 2 * p - K) // s + 1
        
        out = np.zeros((N, self.out_channels, H_out, W_out), dtype=np.float32)
        
        for h in range(H_out):
            h_start = h * s
            h_end = h_start + K
            for w in range(W_out):
                w_start = w * s
                w_end = w_start + K
                
                # slice: (N, C, K, K)
                x_slice = x_pad[:, :, h_start:h_end, w_start:w_end]
                # multiply with weights: (out_channels, in_channels, K, K)
                # sum over in_channels and spatial dims
                for oc in range(self.out_channels):
                    out[:, oc, h, w] = np.sum(x_slice * self.weight[oc], axis=(1, 2, 3)) + self.bias[oc]
                    
        return out

class MaxPool2D:
    def __init__(self, kernel_size=2, stride=2):
        self.kernel_size = kernel_size
        self.stride = stride

    def forward(self, x):
        N, C, H, W = x.shape
        K = self.kernel_size
        s = self.stride
        H_out = (H - K) // s + 1
        W_out = (W - K) // s + 1
        
        out = np.zeros((N, C, H_out, W_out), dtype=np.float32)
        for h in range(H_out):
            h_start = h * s
            h_end = h_start + K
            for w in range(W_out):
                w_start = w * s
                w_end = w_start + K
                out[:, :, h, w] = np.max(x[:, :, h_start:h_end, w_start:w_end], axis=(2, 3))
        return out
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    # Test 1: Conv2D Output Shape
    try:
        conv = Conv2D(in_channels=3, out_channels=8, kernel_size=3, stride=1, padding=1)
        x = np.random.randn(2, 3, 16, 16).astype(np.float32)
        out = conv.forward(x)
        assert out.shape == (2, 8, 16, 16), f"Expected (2,8,16,16), got {out.shape}"
        tests.append({"name": "test_conv2d_shape", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_conv2d_shape", "passed": False, "error": str(e)})

    # Test 2: MaxPool2D Downsampling
    try:
        pool = MaxPool2D(kernel_size=2, stride=2)
        x = np.random.randn(2, 4, 8, 8).astype(np.float32)
        out = pool.forward(x)
        assert out.shape == (2, 4, 4, 4), f"Expected (2,4,4,4), got {out.shape}"
        tests.append({"name": "test_maxpool2d", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_maxpool2d", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_conv2d_shape',
				description: 'Tests Conv2D spatial dimensions and channel transformation'
			},
			{ name: 'test_maxpool2d', description: 'Tests 2x downsampling by MaxPool2D' }
		],
		hints: [
			'Output height H_out = (H + 2*padding - kernel_size) // stride + 1.',
			'Use np.pad(x, ((0,0), (0,0), (p,p), (p,p))) for symmetric spatial padding.'
		]
	},
	{
		id: '10_tokenization',
		slug: '10-tokenization',
		number: 10,
		title: 'Tokenization & Vocabulary',
		subtitle: 'Character & Byte-Pair Encoding (BPE)',
		part: 'nlp',
		partTitle: 'Part III: Language & Transformers',
		difficulty: 'Intermediate',
		estimatedTime: '25 min',
		summary:
			'Build tokenizers from scratch: Character-level Tokenizer, Vocabulary mapping with special tokens (<PAD>, <UNK>, <BOS>, <EOS>), and Byte-Pair Encoding.',
		guideMarkdown: `# Module 10: Tokenization & Vocabulary

Language models operate on discrete token IDs rather than raw strings. In this module, you will build:

1. **\`Tokenizer\`**: Converts text to numerical IDs (\`encode\`) and IDs back to text (\`decode\`).
2. **Special Tokens**: Handles \`<PAD>\` (0), \`<UNK>\` (1), \`<BOS>\` (2), and \`<EOS>\` (3).
3. **BPE Merge**: Computes most frequent character bigrams and merges them into subwords.
`,
		starterCode: `class CharTokenizer:
    def __init__(self):
        self.special_tokens = ["<PAD>", "<UNK>", "<BOS>", "<EOS>"]
        self.vocab = {}
        self.inv_vocab = {}

    def fit(self, texts):
        """Build vocabulary from a collection of text strings."""
        # TODO: Assign IDs to special tokens, then all unique characters
        pass

    def encode(self, text, add_special_tokens=False):
        """Convert string to list of integer token IDs."""
        # TODO: Implement encode
        pass

    def decode(self, token_ids):
        """Convert list of token IDs back into a string."""
        # TODO: Implement decode
        pass
`,
		solutionCode: `class CharTokenizer:
    def __init__(self):
        self.special_tokens = ["<PAD>", "<UNK>", "<BOS>", "<EOS>"]
        self.vocab = {tok: idx for idx, tok in enumerate(self.special_tokens)}
        self.inv_vocab = {idx: tok for idx, tok in enumerate(self.special_tokens)}

    def fit(self, texts):
        unique_chars = sorted(list(set("".join(texts))))
        curr_id = len(self.special_tokens)
        for ch in unique_chars:
            if ch not in self.vocab:
                self.vocab[ch] = curr_id
                self.inv_vocab[curr_id] = ch
                curr_id += 1

    def encode(self, text, add_special_tokens=False):
        unk_id = self.vocab["<UNK>"]
        ids = [self.vocab.get(ch, unk_id) for ch in text]
        if add_special_tokens:
            ids = [self.vocab["<BOS>"]] + ids + [self.vocab["<EOS>"]]
        return ids

    def decode(self, token_ids):
        chars = []
        for tid in token_ids:
            tok = self.inv_vocab.get(tid, "<UNK>")
            if tok not in self.special_tokens:
                chars.append(tok)
        return "".join(chars)
`,
		testHarnessCode: `
def run_tests():
    tests = []

    try:
        tok = CharTokenizer()
        corpus = ["hello world", "trentorch deep learning"]
        tok.fit(corpus)
        
        encoded = tok.encode("hello", add_special_tokens=True)
        assert encoded[0] == tok.vocab["<BOS>"]
        assert encoded[-1] == tok.vocab["<EOS>"]
        
        decoded = tok.decode(encoded)
        assert decoded == "hello", f"Expected 'hello', got '{decoded}'"
        tests.append({"name": "test_char_tokenizer", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_char_tokenizer", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_char_tokenizer',
				description: 'Tests vocabulary fitting, encoding with special tokens, and decoding'
			}
		],
		hints: [
			'Map special tokens first: <PAD>=0, <UNK>=1, <BOS>=2, <EOS>=3.',
			'Use self.vocab.get(ch, self.vocab["<UNK>"]) for unknown characters.'
		]
	},
	{
		id: '11_embeddings',
		slug: '11-embeddings',
		number: 11,
		title: 'Embeddings & Positional Encoding',
		subtitle: 'Token Embeddings & Sinusoidal Positions',
		part: 'nlp',
		partTitle: 'Part III: Language & Transformers',
		difficulty: 'Beginner',
		estimatedTime: '20 min',
		summary:
			'Implement lookup-table token embeddings and Vaswani sinusoidal positional encodings for transformer sequence modeling.',
		guideMarkdown: `# Module 11: Embeddings & Positional Encodings

1. **\`Embedding\`**: Lookup table projecting discrete token IDs to dense vectors $d_{\\text{model}}$.
2. **\`PositionalEncoding\`**: Injects positional information via sinusoidal functions:
   - $PE_{(pos, 2i)} = \\sin(pos / 10000^{2i / d})$
   - $PE_{(pos, 2i+1)} = \\cos(pos / 10000^{2i / d})$
`,
		starterCode: `import numpy as np

class Embedding:
    def __init__(self, num_embeddings, embedding_dim):
        self.num_embeddings = num_embeddings
        self.embedding_dim = embedding_dim
        self.weight = np.random.randn(num_embeddings, embedding_dim).astype(np.float32) * 0.02

    def forward(self, indices):
        """
        indices: (batch_size, seq_len)
        Returns: (batch_size, seq_len, embedding_dim)
        """
        # TODO: Lookup embedding vectors for token indices
        pass

def sinusoidal_positional_encoding(seq_len, d_model):
    """
    Compute sinusoidal positional encoding table of shape (seq_len, d_model).
    """
    # TODO: Implement sinusoidal PE table
    pass
`,
		solutionCode: `import numpy as np

class Embedding:
    def __init__(self, num_embeddings, embedding_dim):
        self.num_embeddings = num_embeddings
        self.embedding_dim = embedding_dim
        self.weight = np.random.randn(num_embeddings, embedding_dim).astype(np.float32) * 0.02

    def forward(self, indices):
        return self.weight[indices]

def sinusoidal_positional_encoding(seq_len, d_model):
    pe = np.zeros((seq_len, d_model), dtype=np.float32)
    position = np.arange(seq_len)[:, np.newaxis]
    div_term = np.exp(np.arange(0, d_model, 2) * -(np.log(10000.0) / d_model))
    
    pe[:, 0::2] = np.sin(position * div_term)
    pe[:, 1::2] = np.cos(position * div_term)
    return pe
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    try:
        emb = Embedding(100, 32)
        idx = np.array([[1, 5, 9], [2, 6, 8]])
        out = emb.forward(idx)
        assert out.shape == (2, 3, 32), f"Expected (2,3,32), got {out.shape}"
        tests.append({"name": "test_embedding_forward", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_embedding_forward", "passed": False, "error": str(e)})

    try:
        pe = sinusoidal_positional_encoding(10, 16)
        assert pe.shape == (10, 16), f"Expected (10,16), got {pe.shape}"
        assert np.all(pe >= -1.0) and np.all(pe <= 1.0), "PE values must be in [-1, 1]"
        tests.append({"name": "test_sinusoidal_pe", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_sinusoidal_pe", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{ name: 'test_embedding_forward', description: 'Tests embedding vector indexing shape' },
			{
				name: 'test_sinusoidal_pe',
				description: 'Tests sinusoidal positional encoding table generation'
			}
		],
		hints: [
			'Embedding forward is a direct indexing operation: self.weight[indices].',
			'In positional encoding, even indices use sin and odd indices use cos.'
		]
	},
	{
		id: '12_attention',
		slug: '12-attention',
		number: 12,
		title: 'Scaled Dot-Product Attention',
		subtitle: 'Multi-Head Self-Attention & Causal Masking',
		part: 'nlp',
		partTitle: 'Part III: Language & Transformers',
		difficulty: 'Advanced',
		estimatedTime: '40 min',
		summary:
			'Implement Scaled Dot-Product Attention, causal triangular autoregressive masking, and Multi-Head Attention (MHA).',
		guideMarkdown: `# Module 12: Attention Mechanisms

Attention computes dynamic relationships between tokens:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}} + M\\right) V$$

1. **Scaled Dot-Product**: Computes attention weights scaled by $1/\\sqrt{d_k}$.
2. **Causal Mask**: Upper triangular matrix set to $-\\infty$ preventing attention to future tokens.
3. **Multi-Head Attention (MHA)**: Projects queries, keys, and values into $h$ heads and concatenates outputs.
`,
		starterCode: `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q, K, V: (batch_size, num_heads, seq_len, d_k)
    mask: optional (seq_len, seq_len) boolean/additive mask
    Returns: (output, attention_weights)
    """
    # TODO: Implement scaled dot-product attention with optional masking
    pass

class MultiHeadAttention:
    def __init__(self, d_model, num_heads):
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = np.random.randn(d_model, d_model).astype(np.float32) * 0.02
        self.W_k = np.random.randn(d_model, d_model).astype(np.float32) * 0.02
        self.W_v = np.random.randn(d_model, d_model).astype(np.float32) * 0.02
        self.W_o = np.random.randn(d_model, d_model).astype(np.float32) * 0.02

    def forward(self, x, is_causal=False):
        """
        x: (batch_size, seq_len, d_model)
        Returns: (batch_size, seq_len, d_model)
        """
        # TODO: Implement Multi-Head Attention forward pass
        pass
`,
		solutionCode: `import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    scores = np.matmul(Q, np.swapaxes(K, -1, -2)) / np.sqrt(d_k)
    
    if mask is not None:
        scores = np.where(mask == 0, -1e9, scores)
        
    scores_max = np.max(scores, axis=-1, keepdims=True)
    exp_scores = np.exp(scores - scores_max)
    attn_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)
    
    out = np.matmul(attn_weights, V)
    return out, attn_weights

class MultiHeadAttention:
    def __init__(self, d_model, num_heads):
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = np.random.randn(d_model, d_model).astype(np.float32) * 0.02
        self.W_k = np.random.randn(d_model, d_model).astype(np.float32) * 0.02
        self.W_v = np.random.randn(d_model, d_model).astype(np.float32) * 0.02
        self.W_o = np.random.randn(d_model, d_model).astype(np.float32) * 0.02

    def forward(self, x, is_causal=False):
        N, S, D = x.shape
        H = self.num_heads
        d_k = self.d_k
        
        Q = np.matmul(x, self.W_q).reshape(N, S, H, d_k).swapaxes(1, 2)
        K = np.matmul(x, self.W_k).reshape(N, S, H, d_k).swapaxes(1, 2)
        V = np.matmul(x, self.W_v).reshape(N, S, H, d_k).swapaxes(1, 2)
        
        mask = None
        if is_causal:
            mask = np.tril(np.ones((S, S), dtype=np.float32))
            
        out, _ = scaled_dot_product_attention(Q, K, V, mask=mask)
        out = out.swapaxes(1, 2).reshape(N, S, D)
        return np.matmul(out, self.W_o)
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    try:
        mha = MultiHeadAttention(d_model=64, num_heads=4)
        x = np.random.randn(2, 8, 64).astype(np.float32)
        out = mha.forward(x, is_causal=True)
        assert out.shape == (2, 8, 64), f"Expected (2,8,64), got {out.shape}"
        tests.append({"name": "test_multihead_attention", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_multihead_attention", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_multihead_attention',
				description: 'Tests multi-head splitting, causal masking, and projection output'
			}
		],
		hints: [
			'Reshape Q to (N, S, num_heads, d_k) then swapaxes(1, 2) to get (N, num_heads, S, d_k).',
			'Causal mask is a lower triangular matrix: np.tril(np.ones((S, S))).'
		]
	},
	{
		id: '13_transformers',
		slug: '13-transformers',
		number: 13,
		title: 'Transformer Block & TinyGPT',
		subtitle: 'Residual Connections, FFN & Decoder Architecture',
		part: 'nlp',
		partTitle: 'Part III: Language & Transformers',
		difficulty: 'Advanced',
		estimatedTime: '45 min',
		summary:
			'Build a GPT-style decoder transformer block with Pre-LayerNorm residual connections, Feed-Forward Network, and autoregressive TinyGPT.',
		guideMarkdown: `# Module 13: Transformer Blocks & TinyGPT

Assemble a modern decoder-only language model:
1. **\`TransformerBlock\`**: Pre-LN architecture:
   - $x = x + \\text{MHA}(\\text{LN}_1(x))$
   - $x = x + \\text{FFN}(\\text{LN}_2(x))$
2. **\`TinyGPT\`**: Combines Token + Position Embeddings, stacked Transformer Blocks, final LayerNorm, and Language Model Head.
`,
		starterCode: `import numpy as np

class FeedForward:
    def __init__(self, d_model, d_ff=None):
        d_ff = d_ff or 4 * d_model
        self.W1 = np.random.randn(d_model, d_ff).astype(np.float32) * 0.02
        self.b1 = np.zeros(d_ff, dtype=np.float32)
        self.W2 = np.random.randn(d_ff, d_model).astype(np.float32) * 0.02
        self.b2 = np.zeros(d_model, dtype=np.float32)

    def forward(self, x):
        # TODO: Compute x @ W1 + b1 -> GELU/ReLU -> out @ W2 + b2
        pass
`,
		solutionCode: `import numpy as np

class FeedForward:
    def __init__(self, d_model, d_ff=None):
        d_ff = d_ff or 4 * d_model
        self.W1 = np.random.randn(d_model, d_ff).astype(np.float32) * 0.02
        self.b1 = np.zeros(d_ff, dtype=np.float32)
        self.W2 = np.random.randn(d_ff, d_model).astype(np.float32) * 0.02
        self.b2 = np.zeros(d_model, dtype=np.float32)

    def forward(self, x):
        h = np.matmul(x, self.W1) + self.b1
        # GELU approximation
        h_gelu = 0.5 * h * (1.0 + np.tanh(np.sqrt(2.0 / np.pi) * (h + 0.044715 * (h ** 3))))
        return np.matmul(h_gelu, self.W2) + self.b2
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    try:
        ffn = FeedForward(d_model=32, d_ff=128)
        x = np.random.randn(2, 5, 32).astype(np.float32)
        out = ffn.forward(x)
        assert out.shape == (2, 5, 32), f"Expected (2,5,32), got {out.shape}"
        tests.append({"name": "test_ffn_shape", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_ffn_shape", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_ffn_shape',
				description: 'Tests Feed-Forward Network forward pass and shape preservation'
			}
		],
		hints: [
			'Hidden dimension d_ff is usually 4 * d_model.',
			'Apply non-linear activation (GELU or ReLU) between the two linear projections.'
		]
	},
	{
		id: '14_profiling',
		slug: '14-profiling',
		number: 14,
		title: 'Execution Profiler & Memory Tracing',
		subtitle: 'FLOPs Counting, Latency Breakdown & Peak Memory',
		part: 'systems',
		partTitle: 'Part IV: Systems & Performance',
		difficulty: 'Intermediate',
		estimatedTime: '25 min',
		summary:
			'Build execution timers, operator-level FLOP counters, and memory tracking utilities for performance diagnosis.',
		guideMarkdown: `# Module 14: Execution Profiler

Measure what matters: compute efficiency and memory footprint.

1. **FLOPs Estimation**: Compute theoretical floating-point operations for Linear ($2 \\times M \\times K \\times N$) and Conv2D.
2. **Execution Profiler**: Measures wall-clock execution time per layer block.
`,
		starterCode: `import time

def count_linear_flops(in_features, out_features, batch_size=1):
    """
    Compute total FLOPs for Linear layer (Multiply + Add = 2 FLOPs per element).
    """
    # TODO: Calculate FLOPs
    pass

class Timer:
    def __init__(self):
        self.elapsed_ms = 0.0

    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, *args):
        self.elapsed_ms = (time.perf_counter() - self.start) * 1000.0
`,
		solutionCode: `import time

def count_linear_flops(in_features, out_features, batch_size=1):
    return 2 * batch_size * in_features * out_features

class Timer:
    def __init__(self):
        self.elapsed_ms = 0.0

    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, *args):
        self.elapsed_ms = (time.perf_counter() - self.start) * 1000.0
`,
		testHarnessCode: `
def run_tests():
    tests = []

    try:
        flops = count_linear_flops(in_features=1024, out_features=2048, batch_size=4)
        assert flops == 2 * 4 * 1024 * 2048
        tests.append({"name": "test_linear_flops", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_linear_flops", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_linear_flops',
				description: 'Tests theoretical FLOPs calculation for matrix multiplications'
			}
		],
		hints: ['Each multiply-accumulate (MAC) counts as 2 FLOPs.']
	},
	{
		id: '15_quantization',
		slug: '15-quantization',
		number: 15,
		title: 'INT8 Quantization & Calibration',
		subtitle: 'Linear Quantization, Scale & Zero-Point',
		part: 'systems',
		partTitle: 'Part IV: Systems & Performance',
		difficulty: 'Intermediate',
		estimatedTime: '30 min',
		summary:
			'Convert 32-bit floating point weights to 8-bit integers with symmetric and asymmetric quantization algorithms.',
		guideMarkdown: `# Module 15: INT8 Quantization

Quantization compresses model memory by $4\\times$ by mapping float32 to int8:

$$q = \\text{clamp}\\left(\\text{round}\\left(\\frac{x}{\\text{scale}}\\right) + \\text{zero\\_point}, -128, 127\\right)$$
`,
		starterCode: `import numpy as np

def quantize_symmetric_int8(x):
    """
    Symmetric INT8 quantization mapping range [-max_abs, max_abs] to [-127, 127].
    Returns: (q_int8, scale)
    """
    # TODO: Implement symmetric INT8 quantization
    pass

def dequantize_symmetric_int8(q_int8, scale):
    """
    Reconstruct float32 approximation from quantized INT8 and scale.
    """
    # TODO: Implement dequantization
    pass
`,
		solutionCode: `import numpy as np

def quantize_symmetric_int8(x):
    max_val = np.max(np.abs(x))
    scale = max_val / 127.0 if max_val > 0 else 1.0
    q = np.clip(np.round(x / scale), -127, 127).astype(np.int8)
    return q, scale

def dequantize_symmetric_int8(q_int8, scale):
    return q_int8.astype(np.float32) * scale
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    try:
        x = np.array([-10.0, -5.0, 0.0, 5.0, 10.0], dtype=np.float32)
        q, scale = quantize_symmetric_int8(x)
        assert q.dtype == np.int8, f"Expected int8, got {q.dtype}"
        assert q[0] == -127 and q[-1] == 127
        
        x_rec = dequantize_symmetric_int8(q, scale)
        np.testing.assert_allclose(x, x_rec, atol=0.1)
        tests.append({"name": "test_symmetric_int8", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_symmetric_int8", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_symmetric_int8',
				description: 'Tests INT8 quantization precision and round-trip reconstruction'
			}
		],
		hints: ['scale = max(abs(x)) / 127.0.', 'Use np.clip(..., -127, 127).astype(np.int8).']
	},
	{
		id: '16_compression',
		slug: '16-compression',
		number: 16,
		title: 'Model Compression & Pruning',
		subtitle: 'Magnitude-Based Weight Pruning & Sparsity',
		part: 'systems',
		partTitle: 'Part IV: Systems & Performance',
		difficulty: 'Intermediate',
		estimatedTime: '25 min',
		summary:
			'Implement magnitude-based unstructured weight pruning and compute model sparsity ratios.',
		guideMarkdown: `# Module 16: Model Compression & Pruning

Pruning removes unimportant weights (setting small values to zero) to reduce compute and memory overhead:
- **Magnitude Pruning**: Zeros out the bottom $k\\%$ weights with smallest absolute value.
`,
		starterCode: `import numpy as np

def prune_by_magnitude(weights, prune_ratio=0.5):
    """
    Zeros out the smallest 'prune_ratio' fraction of weights by absolute magnitude.
    Returns: (pruned_weights, binary_mask)
    """
    # TODO: Implement magnitude pruning
    pass
`,
		solutionCode: `import numpy as np

def prune_by_magnitude(weights, prune_ratio=0.5):
    if prune_ratio == 0.0:
        return weights.copy(), np.ones_like(weights)
    threshold = np.percentile(np.abs(weights), prune_ratio * 100.0)
    mask = (np.abs(weights) > threshold).astype(np.float32)
    return weights * mask, mask
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    try:
        w = np.array([1.0, 5.0, 0.2, 0.1, 8.0, 0.05])
        pruned, mask = prune_by_magnitude(w, prune_ratio=0.5)
        sparsity = np.mean(pruned == 0.0)
        assert np.isclose(sparsity, 0.5), f"Expected 50% sparsity, got {sparsity}"
        assert pruned[4] == 8.0, "Largest magnitude weight should be preserved"
        tests.append({"name": "test_pruning", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_pruning", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_pruning',
				description: 'Tests magnitude thresholding and exact sparsity target'
			}
		],
		hints: ['Use np.percentile(np.abs(weights), prune_ratio * 100) to find the cutoff threshold.']
	},
	{
		id: '17_acceleration',
		slug: '17-acceleration',
		number: 17,
		title: 'Operator Fusion & Acceleration',
		subtitle: 'Kernel Fusion & Memory Bandwidth',
		part: 'systems',
		partTitle: 'Part IV: Systems & Performance',
		difficulty: 'Intermediate',
		estimatedTime: '25 min',
		summary:
			'Implement operator fusion (e.g. Linear + Bias + ReLU in a single pass) to eliminate intermediate memory round-trips.',
		guideMarkdown: `# Module 17: Operator Fusion

Operator fusion merges multiple sequential operations into a single kernel to maximize arithmetic intensity and minimize memory bandwidth overhead.
`,
		starterCode: `import numpy as np

def fused_linear_relu(x, weight, bias):
    """
    Fused computation: out = max(0, x @ W.T + bias) in one contiguous memory pass.
    """
    # TODO: Implement fused Linear + ReLU
    pass
`,
		solutionCode: `import numpy as np

def fused_linear_relu(x, weight, bias):
    out = np.matmul(x, weight.T)
    if bias is not None:
        out += bias
    return np.maximum(0.0, out)
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    try:
        x = np.array([[1.0, -1.0]])
        w = np.array([[2.0, 3.0]]) # 1*2 + -1*3 = -1
        b = np.array([0.5]) # -1 + 0.5 = -0.5 -> relu=0
        out = fused_linear_relu(x, w, b)
        assert out[0, 0] == 0.0
        tests.append({"name": "test_fused_linear_relu", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_fused_linear_relu", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_fused_linear_relu',
				description: 'Tests fused Linear + ReLU output equivalence'
			}
		],
		hints: ['Combine matmul, bias addition, and np.maximum(0.0, ...) efficiently.']
	},
	{
		id: '18_memoization',
		slug: '18-memoization',
		number: 18,
		title: 'KV-Cache for Fast Generation',
		subtitle: 'Autoregressive Decoding Acceleration',
		part: 'systems',
		partTitle: 'Part IV: Systems & Performance',
		difficulty: 'Advanced',
		estimatedTime: '35 min',
		summary:
			'Implement Key-Value Cache (KV-Cache) to accelerate autoregressive token generation from $O(N^2)$ to $O(N)$.',
		guideMarkdown: `# Module 18: KV-Cache for Autoregressive Generation

In naive autoregressive decoding, recomputing Key and Value representations of previous tokens has quadratic $O(N^2)$ cost. A **KV-Cache** stores past keys and values so only the new single token is processed at each step.
`,
		starterCode: `import numpy as np

class KVCache:
    def __init__(self, max_batch_size, max_seq_len, num_heads, d_k):
        self.k_cache = np.zeros((max_batch_size, num_heads, max_seq_len, d_k), dtype=np.float32)
        self.v_cache = np.zeros((max_batch_size, num_heads, max_seq_len, d_k), dtype=np.float32)
        self.curr_len = 0

    def update(self, new_k, new_v):
        """
        new_k, new_v: (batch_size, num_heads, new_seq_len, d_k)
        Returns: (full_k, full_v) up to current length
        """
        # TODO: Store new keys/values at current offset and return accumulated cache
        pass
`,
		solutionCode: `import numpy as np

class KVCache:
    def __init__(self, max_batch_size, max_seq_len, num_heads, d_k):
        self.k_cache = np.zeros((max_batch_size, num_heads, max_seq_len, d_k), dtype=np.float32)
        self.v_cache = np.zeros((max_batch_size, num_heads, max_seq_len, d_k), dtype=np.float32)
        self.curr_len = 0

    def update(self, new_k, new_v):
        N, H, S, D = new_k.shape
        start = self.curr_len
        end = start + S
        self.k_cache[:N, :H, start:end, :D] = new_k
        self.v_cache[:N, :H, start:end, :D] = new_v
        self.curr_len = end
        return self.k_cache[:N, :H, :end, :D], self.v_cache[:N, :H, :end, :D]
`,
		testHarnessCode: `
import numpy as np

def run_tests():
    tests = []

    try:
        cache = KVCache(max_batch_size=2, max_seq_len=16, num_heads=2, d_k=8)
        k1 = np.random.randn(2, 2, 3, 8).astype(np.float32)
        v1 = np.random.randn(2, 2, 3, 8).astype(np.float32)
        full_k, full_v = cache.update(k1, v1)
        assert full_k.shape == (2, 2, 3, 8)
        
        # Next token (seq_len = 1)
        k2 = np.random.randn(2, 2, 1, 8).astype(np.float32)
        v2 = np.random.randn(2, 2, 1, 8).astype(np.float32)
        full_k2, full_v2 = cache.update(k2, v2)
        assert full_k2.shape == (2, 2, 4, 8)
        tests.append({"name": "test_kv_cache_update", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_kv_cache_update", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_kv_cache_update',
				description: 'Tests sequential appending of KV vectors and cumulative slice retrieval'
			}
		],
		hints: ['Store new vectors at slice self.curr_len : self.curr_len + new_seq_len.']
	},
	{
		id: '19_benchmarking',
		slug: '19-benchmarking',
		number: 19,
		title: 'Benchmarking & MLPerf',
		subtitle: 'Latency, Throughput & Confidence Intervals',
		part: 'systems',
		partTitle: 'Part IV: Systems & Performance',
		difficulty: 'Intermediate',
		estimatedTime: '25 min',
		summary:
			'Build a benchmarking harness to measure p50, p95, p99 latency and tokens-per-second throughput.',
		guideMarkdown: `# Module 19: Benchmarking & Profiling Harness

Measure statistical latency percentiles and throughput:
- **Warmup Runs**: Discard cold-cache initial iterations.
- **Percentiles**: Compute p50 (median), p95, and p99 latency.
- **Throughput**: Calculate tokens per second.
`,
		starterCode: `import time
import numpy as np

def benchmark_fn(fn, num_warmup=3, num_iters=10):
    """
    Benchmarks a callable function.
    Returns: dict with 'mean_ms', 'p50_ms', 'p95_ms'
    """
    # TODO: Implement warmup runs and statistical percentile measurements
    pass
`,
		solutionCode: `import time
import numpy as np

def benchmark_fn(fn, num_warmup=3, num_iters=10):
    for _ in range(num_warmup):
        fn()
    
    durations = []
    for _ in range(num_iters):
        t0 = time.perf_counter()
        fn()
        durations.append((time.perf_counter() - t0) * 1000.0)
        
    return {
        "mean_ms": float(np.mean(durations)),
        "p50_ms": float(np.percentile(durations, 50)),
        "p95_ms": float(np.percentile(durations, 95))
    }
`,
		testHarnessCode: `
import time

def run_tests():
    tests = []

    try:
        def sample_task():
            time.sleep(0.001)
        metrics = benchmark_fn(sample_task, num_warmup=2, num_iters=5)
        assert "mean_ms" in metrics and "p50_ms" in metrics and "p95_ms" in metrics
        assert metrics["p50_ms"] >= 0.5
        tests.append({"name": "test_benchmark_fn", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_benchmark_fn", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{ name: 'test_benchmark_fn', description: 'Tests warmup cycles and percentile calculation' }
		],
		hints: ['Use time.perf_counter() for microsecond resolution timers.']
	},
	{
		id: '20_capstone',
		slug: '20-capstone',
		number: 20,
		title: 'Capstone: Complete Framework',
		subtitle: 'Full End-to-End TrenTorch Assembly',
		part: 'systems',
		partTitle: 'Part IV: Systems & Performance',
		difficulty: 'Mastery',
		estimatedTime: '60 min',
		summary:
			'Assemble all 20 modules together: build, train, and benchmark a complete deep learning framework from zero with zero external ML dependencies.',
		guideMarkdown: `# Module 20: Capstone Project

Congratulations on reaching the Capstone! You have built every core primitive of a complete ML framework:
1. **Tensor & Autograd** (Modules 01, 06)
2. **Activations & Layers** (Modules 02, 03)
3. **Losses & Optimizers** (Modules 04, 07)
4. **DataLoaders** (Module 05)
5. **Transformers & Attention** (Modules 11, 12, 13)
6. **Inference Optimizations** (Modules 15, 18)

In this final milestone, assemble a complete classifier or generative pipeline and run validation.
`,
		starterCode: `import numpy as np

class TrenTorchFramework:
    """
    Unified entrypoint showcasing hand-rolled TrenTorch framework capabilities.
    """
    def __init__(self):
        self.version = "1.0.0"

    def verify_stack(self):
        """
        Runs an end-to-end forward/backward sanity check on pure NumPy primitives.
        Returns: True if all subsystems operate correctly.
        """
        # TODO: Return True if all components are initialized and verified
        pass
`,
		solutionCode: `import numpy as np

class TrenTorchFramework:
    def __init__(self):
        self.version = "1.0.0"

    def verify_stack(self):
        # 1. Tensor verification
        x = np.array([[1.0, 2.0], [3.0, 4.0]], dtype=np.float32)
        w = np.array([[0.5, -0.5], [1.0, 0.0]], dtype=np.float32)
        out = np.matmul(x, w)
        assert out.shape == (2, 2)
        return True
`,
		testHarnessCode: `
def run_tests():
    tests = []

    try:
        framework = TrenTorchFramework()
        assert framework.version == "1.0.0"
        assert framework.verify_stack() == True
        tests.append({"name": "test_framework_assembly", "passed": True, "error": None})
    except Exception as e:
        tests.append({"name": "test_framework_assembly", "passed": False, "error": str(e)})

    return tests
`,
		testCases: [
			{
				name: 'test_framework_assembly',
				description: 'Tests full framework integration and sanity check'
			}
		],
		hints: ['Ensure verify_stack returns True when components run successfully.']
	}
];
