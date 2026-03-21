import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { email, name, propertyType, area, rooms, needs } = body;

    if (!email || !name || !propertyType || !area) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real implementation:
    // 1. Save to database (Supabase)
    // 2. Send email via Resend to gioarqt.1@gmail.com
    // 3. Maybe send confirmation email to user

    const simulationId = `SIM-${Date.now()}`;

    return NextResponse.json({
      success: true,
      simulationId,
      message: "Simulação recebida com sucesso. Giovanna Lima entrará em contato em breve.",
      data: {
        email,
        name,
        propertyType,
        area,
        rooms,
        needs,
        submittedAt: new Date().toISOString(),
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Erro no processamento da simulação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}