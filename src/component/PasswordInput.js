import React, { useState } from 'react';

function PasswordInput({
  placeholder = "••••••••",
  value,
  onChange,
  required = true,
  label = "Mot de passe"
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900 transition"
          title={showPassword ? "Masquer" : "Afficher"}
        >
          {showPassword ? (
            <span className="text-lg">👁️</span>
          ) : (
            <span className="text-lg">👁️‍🗨️</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
