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
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="input pr-12"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition"
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
