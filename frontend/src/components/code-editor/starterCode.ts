export const starterCode: Record<string, string> = {
  javascript: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,

  python: `def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

  typescript: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,

  php: `<?php
function greet($name) {
    return "Hello, $name!";
}

echo greet("World");
?>`,

  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Minimal App</title>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: system-ui, -apple-system, sans-serif;
    }

    body {
      background: #0f172a;
      color: #e2e8f0;
      line-height: 1.6;
    }

    .container {
      max-width: 900px;
      margin: auto;
      padding: 40px 20px;
    }

    .hero {
      text-align: center;
      padding: 80px 0;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 10px;
    }

    .hero p {
      color: #94a3b8;
      font-size: 1.1rem;
      margin-bottom: 20px;
    }

    .btn {
      padding: 12px 28px;
      background: #38bdf8;
      color: #020617;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }

    .btn:hover {
      background: #0ea5e9;
    }

    .section {
      margin-top: 60px;
    }

    .section h2 {
      font-size: 1.8rem;
      margin-bottom: 10px;
    }

    .section p {
      color: #94a3b8;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }

    .card {
      background: #020617;
      padding: 20px;
      border-radius: 10px;
      border: 1px solid #1e293b;
    }

    footer {
      margin-top: 80px;
      text-align: center;
      color: #64748b;
      font-size: 0.9rem;
    }
  </style>
</head>

<body>

  <div class="container">

    <section class="hero">
      <h1>Code. Build. Ship.</h1>
      <p>A clean starting point to create something meaningful.</p>
      <button class="btn" id="actionBtn">Start Now</button>
    </section>

    <section class="section">
      <h2>Why This Template</h2>
      <p>
        This layout focuses on clarity, spacing, and readability. No distractions,
        no unnecessary elements — just structure and clean design.
      </p>

      <div class="grid">
        <div class="card">
          <h3>Simple</h3>
          <p>Easy to understand and extend.</p>
        </div>
        <div class="card">
          <h3>Responsive</h3>
          <p>Works well on all screen sizes.</p>
        </div>
        <div class="card">
          <h3>Modern</h3>
          <p>Clean UI with good visual hierarchy.</p>
        </div>
      </div>
    </section>

    <footer>
      <p>© 2026 Minimal App</p>
    </footer>

  </div>

  <script>
    const btn = document.getElementById("actionBtn");

    btn.addEventListener("click", () => {
      document.body.style.background = "#020617";
      alert("You're ready to build 🚀");
    });
  </script>

</body>
</html>`
};
