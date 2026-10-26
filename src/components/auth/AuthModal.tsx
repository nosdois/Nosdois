/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { loginWithEmail, registerWithEmail, sendPasswordReset, getFriendlyAuthErrorMessage } from '../../services/authService';
import { UserProfile } from '../../types';
import { sound } from '../../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

const AVATAR_OPTIONS = ['💜', '🌸', '👑', '✨', '🦊', '🐻', '🌹', '🍓', '☕', '🪐', '🎸', '🌟'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('💜');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail.');
      return;
    }

    try {
      setLoading(true);

      if (mode === 'login') {
        if (!password) {
          setErrorMessage('Por favor, digite sua senha.');
          setLoading(false);
          return;
        }
        const profile = await loginWithEmail(email, password);
        sound.playSuccess();
        onAuthSuccess(profile);
        onClose();
      } else if (mode === 'register') {
        if (!displayName.trim()) {
          setErrorMessage('Informe seu nome ou apelido carinhoso.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('As senhas não coincidem.');
          setLoading(false);
          return;
        }
        const profile = await registerWithEmail(email, password, displayName, avatar);
        sound.playSuccess();
        onAuthSuccess(profile);
        onClose();
      } else if (mode === 'forgot') {
        await sendPasswordReset(email);
        sound.playSuccess();
        setResetSent(true);
      }
    } catch (err: any) {
      sound.playBuzzer();
      console.error('Auth error:', err);
      const msg = getFriendlyAuthErrorMessage(err?.code || '');
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#082F2B] border border-[#17675C] w-full max-w-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-[#BBD9D2] hover:text-[#FFFDF7] rounded-full hover:bg-[#104B43] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#104B43] border border-[#17675C] flex items-center justify-center text-2xl mx-auto mb-2 text-[#FFD15C] shadow-inner">
            <Sparkles className="w-6 h-6 text-[#FFD15C]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#FFFDF7]">
            {mode === 'login' && 'Entrar no Nós Dois'}
            {mode === 'register' && 'Criar Conta Individual'}
            {mode === 'forgot' && 'Recuperar Senha'}
          </h2>
          <p className="text-xs text-[#BBD9D2] mt-1">
            {mode === 'login' && 'Acesse seus dados salvos e conecte com seu parceiro.'}
            {mode === 'register' && 'Crie sua conta para sincronizar partidas entre celulares.'}
            {mode === 'forgot' && 'Digite seu e-mail cadastrado para receber o link.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="flex bg-[#073630] border border-[#17675C] rounded-xl p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#FFD15C] text-[#063F39] shadow-sm'
                  : 'text-[#BBD9D2] hover:text-[#FFFDF7]'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#FFD15C] text-[#063F39] shadow-sm'
                  : 'text-[#BBD9D2] hover:text-[#FFFDF7]'
              }`}
            >
              Criar Conta
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#3A1E24] border border-[#F16D7A] text-xs text-[#FFFDF7] flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-[#F16D7A] shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Forgot Password Success Message */}
        {mode === 'forgot' && resetSent ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#104B43] text-[#FFD15C] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#FFD15C]" />
            </div>
            <p className="text-xs text-[#FFFDF7] leading-relaxed">
              Enviamos um link de redefinição de senha para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
            </p>
            <button
              type="button"
              onClick={() => {
                setResetSent(false);
                setMode('login');
              }}
              className="px-6 py-2 bg-[#FFD15C] text-[#063F39] font-bold text-xs rounded-xl cursor-pointer"
            >
              Voltar para o Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Display Name (only for register) */}
            {mode === 'register' && (
              <div>
                <label className="text-[11px] font-semibold text-[#BBD9D2] uppercase tracking-wider block mb-1">
                  Seu Nome ou Apelido
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8AAFA7] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ex: Matheus ou Bia"
                    maxLength={30}
                    className="w-full bg-[#073630] border border-[#17675C] focus:border-[#FFD15C] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#FFFDF7] placeholder-[#8AAFA7] focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Avatar Selection (only for register) */}
            {mode === 'register' && (
              <div>
                <label className="text-[11px] font-semibold text-[#BBD9D2] uppercase tracking-wider block mb-1">
                  Escolha Seu Avatar
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-[#073630] border border-[#17675C] rounded-xl">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatar(emoji)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-all ${
                        avatar === emoji
                          ? 'bg-[#104B43] border-2 border-[#FFD15C] scale-110'
                          : 'hover:bg-[#104B43]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-[11px] font-semibold text-[#BBD9D2] uppercase tracking-wider block mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8AAFA7] absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-[#073630] border border-[#17675C] focus:border-[#FFD15C] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#FFFDF7] placeholder-[#8AAFA7] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-[#BBD9D2] uppercase tracking-wider">
                    Senha
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage(null);
                      }}
                      className="text-[11px] text-[#FFD15C] hover:underline cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8AAFA7] absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    className="w-full bg-[#073630] border border-[#17675C] focus:border-[#FFD15C] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#FFFDF7] placeholder-[#8AAFA7] focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Confirm Password (only for register) */}
            {mode === 'register' && (
              <div>
                <label className="text-[11px] font-semibold text-[#BBD9D2] uppercase tracking-wider block mb-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8AAFA7] absolute left-3 top-3" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha"
                    minLength={6}
                    className="w-full bg-[#073630] border border-[#17675C] focus:border-[#FFD15C] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#FFFDF7] placeholder-[#8AAFA7] focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#FFD15C] hover:bg-[#EAB83F] disabled:opacity-50 text-[#063F39] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#FFD15C]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-[#063F39] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Entrar na Conta'}
                      {mode === 'register' && 'Concluir Cadastro'}
                      {mode === 'forgot' && 'Enviar E-mail de Recuperação'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#063F39]" />
                  </>
                )}
              </button>
            </div>

            {mode === 'forgot' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="text-xs text-[#BBD9D2] hover:text-[#FFD15C] underline cursor-pointer"
                >
                  Voltar para tela de login
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
